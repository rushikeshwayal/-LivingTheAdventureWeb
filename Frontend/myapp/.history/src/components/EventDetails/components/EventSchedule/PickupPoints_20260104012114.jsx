function PickupPoints({ pickups }) {
    return (
        <div>
            <h3 className="text-2xl font-semibold text-white mb-8">
                Pickup Locations
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
                {pickups.map(pickup => (
                    <div
                        key={pickup.pickup_uuid}
                        className="
              p-6 rounded-2xl
              bg-white/[0.04]
              border border-white/10
              hover:bg-white/[0.07]
              transition
            "
                    >
                        <h4 className="text-lg font-semibold text-white mb-2">
                            {pickup.pickup_point} ({pickup.city_name})
                        </h4>

                        <p className="text-gray-400 text-sm mb-3">
                            {pickup.address.street_address}
                        </p>

                        <div className="flex justify-between text-gray-300 text-sm">
                            <span className="flex items-center gap-2">
                                <MdOutlineAccessTime />
                                {new Date(pickup.pickup_datetime).toLocaleTimeString()}
                            </span>

                            <span className="flex items-center gap-1">
                                <MdOutlineCurrencyRupee />
                                {pickup.price_per_person}
                            </span>
                        </div>

                        <a
                            href={pickup.address.google_map_url}
                            target="_blank"
                            className="inline-flex items-center gap-1 mt-4 text-teal-400 text-sm"
                        >
                            <MdOutlineLocationOn /> View on Map
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
