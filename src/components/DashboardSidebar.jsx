import React, { useState } from 'react';

export default function DashboardSidebar({ stats, onUpload }) {
    return (
        <div className="h-full w-80 bg-white shadow-xl flex flex-col z-20 relative">
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    🇬🇧 Flood Watch
                    <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Ind.</span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">Industrial Risk Analysis</p>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="text-sm text-blue-600 font-medium">Buildings</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.buildings_identified || 0}</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="text-sm text-red-600 font-medium">Critical</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.flood_warnings_active || 0}</div>
                </div>
            </div>

            <div className="px-6 py-2">
                <label className="block w-full cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <span className="text-sm font-medium text-gray-600">Upload CSV Locations</span>
                    <input type="file" className="hidden" onChange={onUpload} accept=".csv" />
                </label>
            </div>

            {stats.warnings_summary && stats.warnings_summary.length > 0 && (
                <div className="px-6 py-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Live Flood Alerts</h3>
                    <div className="space-y-2">
                        {stats.warnings_summary.map((w, idx) => (
                            <div key={idx} className="bg-red-50 border border-red-100 p-3 rounded-md text-xs">
                                <div className="font-bold text-red-700 mb-1 flex justify-between">
                                    <span>{w.severity}</span>
                                    <span>Level {w.severityLevel}</span>
                                </div>
                                <div className="text-red-900 mb-1 font-medium">{w.area_name}</div>
                                <div className="text-gray-600 line-clamp-3 leading-relaxed">
                                    {w.message}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Identified Assets</h3>
                <div className="space-y-3">
                    {stats.details && stats.details.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className={`w-2 h-2 mt-1.5 rounded-full ${item.risk === 'RED' ? 'bg-red-500' : item.risk === 'AMBER' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                            <div>
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.type}</div>
                            </div>
                        </div>
                    ))}
                    {(!stats.details || stats.details.length === 0) && (
                        <div className="text-center text-gray-400 text-sm py-4">
                            Draw an area or upload CSV to begin analysis.
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 border-t border-gray-100 text-xs text-center text-gray-400">
                Live EA Data Connected
            </div>
        </div>
    );
}
