import React from 'react';

export default function Legend({ showStations, setShowStations, showFloods, setShowFloods }) {
    return (
        <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4 min-w-[200px]">
            <h3 className="font-bold text-gray-800 text-sm mb-3">Map Layers</h3>

            {/* Stations Toggle */}
            <div className="mb-3">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showStations}
                        onChange={(e) => setShowStations(e.target.checked)}
                        className="mr-2"
                    />
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-600"></div>
                        <span className="text-xs text-gray-700">Monitoring Stations</span>
                    </div>
                </label>
            </div>

            {/* Flood Zones Toggle */}
            <div className="mb-2">
                <label className="flex items-center cursor-pointer mb-2">
                    <input
                        type="checkbox"
                        checked={showFloods}
                        onChange={(e) => setShowFloods(e.target.checked)}
                        className="mr-2"
                    />
                    <span className="text-xs font-medium text-gray-700">Flood Zones</span>
                </label>

                {/* Flood Severity Legend */}
                {showFloods && (
                    <div className="ml-6 space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-3 border-2" style={{ borderColor: '#7f1d1d', backgroundColor: 'rgba(127, 29, 29, 0.3)' }}></div>
                            <span className="text-[10px] text-gray-600">Severe Warning (L1)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-3 border-2" style={{ borderColor: '#dc2626', backgroundColor: 'rgba(220, 38, 38, 0.3)' }}></div>
                            <span className="text-[10px] text-gray-600">Flood Warning (L2)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-3 border-2" style={{ borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.3)' }}></div>
                            <span className="text-[10px] text-gray-600">Flood Alert (L3)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-3 border-2" style={{ borderColor: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.3)' }}></div>
                            <span className="text-[10px] text-gray-600">Warning Removed (L4)</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
