const stats = [
    {
        number: "50+",
        title: "Women Empowered",
        description: "Direct employment and training"
    },
    {
        number: "5",
        title: "Communities",
        description: "Across Northern Ghana"
    },
    {
        number: "100%",
        title: "Ethical Sourcing",
        description: "Responsible local Materials"
    },
    {
        number: "85%",
        title: "Fair Trade Premium",
        description: "Goes directly to Producers"
    }
];

export default function SheaStrong() {
    return (
        <div className="bg-[#FEFCE4] py-12 sm:py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section - Mobile Responsive */}
                <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-900 mb-3 sm:mb-4 mt-2 sm:mt-4 font-bold leading-tight">
                        The SheaStrong Initiative
                    </h1>
                    <p className="text-base sm:text-lg text-amber-700 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
                        Our commitment goes beyond beautiful skin.
                        Through SheaStrong, we're empowering women across Ghana's Shea value chain,
                        creating dignified income opportunities and building stronger communities.
                    </p>
                </div>

                {/* Stats Grid - Mobile Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-amber-100"
                        >
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-600 mb-2 sm:mb-3">
                                {stat.number}
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-amber-800 mb-1 sm:mb-2">
                                {stat.title}
                            </h3>
                            <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}