function Highlights({ highlights }) {
    return (
        <div className="bg-green-300/100 text-black font-bebas w-full h-20 flex items-end justify-center">
            <h1 className="font-bebas text-4xl p-4">
                {highlights}
            </h1>
        </div>
    );
}
export default Highlights;