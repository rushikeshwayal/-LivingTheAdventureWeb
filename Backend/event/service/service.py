"""Event data access and persistence helpers."""

from uuid import uuid4

from sqlalchemy.orm import Session

from event.model.model import Event
from event.schema.schema import EventCreate, EventUpdate


_EVENT_URL_FIELDS = (
    "cover_image_url",
    "poster_horizontal_1_url",
    "poster_horizontal_2_url",
    "poster_vertical_3_url",
    "promo_video_url",
)


def _normalize_event_urls(data: dict) -> dict:
    """Convert Pydantic URL objects to strings without flattening URL lists."""
    for field in _EVENT_URL_FIELDS:
        if data.get(field) is not None:
            data[field] = str(data[field])

    gallery_urls = data.get("gallery_image_urls")
    if gallery_urls is not None:
        data["gallery_image_urls"] = [str(url) for url in gallery_urls]

    return data


def get_events(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(Event)
        .filter(Event.status == "published")
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_event_by_id(db: Session, event_id: int):
    return db.query(Event).filter(Event.id == event_id).first()


def get_event_by_uuid(db: Session, event_uuid):
    return (
        db.query(Event)
        .filter(Event.event_id == event_uuid, Event.status == "published")
        .first()
    )


def create_event(db: Session, event_in: EventCreate):
    event_data = _normalize_event_urls(event_in.model_dump(exclude_unset=True))

    if not event_data.get("event_id"):
        event_data["event_id"] = uuid4()

    db_obj = Event(**event_data)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_event(db: Session, db_obj: Event, event_in: EventUpdate):
    update_data = _normalize_event_urls(event_in.model_dump(exclude_unset=True))

    for field, value in update_data.items():
        if hasattr(db_obj, field):
            setattr(db_obj, field, value)

    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_event(db: Session, db_obj: Event):
    db.delete(db_obj)
    db.commit()


def get_events_by_type(db: Session, event_type: str):
    return (
        db.query(Event)
        .filter(Event.event_type == event_type, Event.status == "published")
        .all()
    )
