import React, { useState, useRef, useEffect } from 'react';

export default function BottomDrawer({ selectedStations, selectedFloods, onClear }) {
    const [activeTab, setActiveTab] = useState('stations');
    const [isExpanded, setIsExpanded] = useState(true);
    const drawerRef = useRef(null);

    const totalSelected = selectedStations.length + selectedFloods.length;

    // Click outside to collapse
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target) && isExpanded) {
                setIsExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isExpanded]);

    if (totalSelected === 0) return null;

    return (
        <div
            ref={drawerRef}
            className={`absolute bottom-0 left-0 right-0 z-[1000] bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-2xl transition-all duration-300 ${isExpanded ? 'h-80' : 'h-12'}`}
        >
            {/* Header with centered collapse button */}
            <div className="relative flex items-center justify-center px-4 py-3 pb-4 border-b border-gray-200/50">
                {/* Centered collapse button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute left-1/2 -translate-x-1/2 text-gray-600 hover:text-gray-900 font-bold"
                >
                    {isExpanded ? '▼' : '▲'}
                </button>

                {/* Left side info */}
                <div className="absolute top-4 left-4 flex items-center gap-3">
                    <h3 className="font-bold text-gray-800 text-sm">Selected Features</h3>
                    <div className="flex gap-2 items-center">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {selectedStations.length} Stations
                        </span>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            {selectedFloods.length} Flood Zones
                        </span>
                    </div>
                </div>

                {/* Right side clear button */}
                <button
                    onClick={onClear}
                    className="absolute right-4 text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-gray-700"
                >
                    Clear Selection
                </button>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="h-[calc(100%-48px)] flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200/50">
                        <button
                            onClick={() => setActiveTab('stations')}
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'stations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        >
                            Stations ({selectedStations.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('floods')}
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'floods' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'}`}
                        >
                            Flood Zones ({selectedFloods.length})
                        </button>
                    </div>

                    {/* Table Content - with proper sticky headers */}
                    <div className="flex-1 overflow-auto">
                        {activeTab === 'stations' && (
                            <table className="w-full text-xs">
                                <thead className="bg-gray-100/80 sticky top-0 z-10">
                                    <tr>
                                        <th className="text-left p-2 font-semibold text-gray-700">Station Name</th>
                                        <th className="text-left p-2 font-semibold text-gray-700">River</th>
                                        <th className="text-left p-2 font-semibold text-gray-700">Coordinates</th>
                                        <th className="text-left p-2 font-semibold text-gray-700">Measures</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedStations.map((station, idx) => (
                                        <tr key={idx} className="border-b border-gray-200/30 hover:bg-blue-50/30">
                                            <td className="p-2 font-medium text-gray-900">{station.label}</td>
                                            <td className="p-2 text-gray-600">{station.riverName || 'N/A'}</td>
                                            <td className="p-2 text-gray-600">{station.lat.toFixed(4)}, {station.long.toFixed(4)}</td>
                                            <td className="p-2 text-gray-600">{station.measures?.length || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'floods' && (
                            <table className="w-full text-xs">
                                <thead className="bg-gray-100/80 sticky top-0 z-10">
                                    <tr>
                                        <th className="text-left p-2 font-semibold text-gray-700">Severity</th>
                                        <th className="text-left p-2 font-semibold text-gray-700">Description</th>
                                        <th className="text-left p-2 font-semibold text-gray-700">County</th>
                                        <th className="text-left p-2 font-semibold text-gray-700">River/Sea</th>
                                        <th className="text-left p-2 font-semibold text-gray-700">Time Raised</th>
                                        <th className="text-left p-2 font-semibold text-gray-700">Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedFloods.map((flood, idx) => (
                                        <tr key={idx} className="border-b border-gray-200/30 hover:bg-red-50/30">
                                            <td className="p-2">
                                                <span className="text-[10px] font-bold px-2 py-1 rounded text-white inline-block"
                                                    style={{
                                                        backgroundColor: flood.properties.severityLevel === 1 ? '#7f1d1d' :
                                                            flood.properties.severityLevel === 2 ? '#dc2626' :
                                                                flood.properties.severityLevel === 3 ? '#f59e0b' : '#fbbf24'
                                                    }}>
                                                    {flood.properties.severity}
                                                </span>
                                            </td>
                                            <td className="p-2 font-medium text-gray-900">{flood.properties.description}</td>
                                            <td className="p-2 text-gray-600">{flood.properties.county || 'N/A'}</td>
                                            <td className="p-2 text-gray-600">{flood.properties.riverOrSea || 'N/A'}</td>
                                            <td className="p-2 text-gray-600">
                                                {flood.properties.timeRaised ? new Date(flood.properties.timeRaised).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="p-2 text-gray-600 max-w-xs truncate">
                                                {flood.properties.message?.substring(0, 100)}...
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
