
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TrackingInfo } from '../types';
import { Card, Button } from './ui';
import type { BorderVariant } from './ui';
import { CARRIER_URLS, XMarkIcon } from '../constants';

const initialTrackingInfo: TrackingInfo = {
  carrier: 'usps',
  trackingNumber: '',
};

const TrackingModal = ({ url, onClose }: { url: string; onClose: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center"
            onClick={onClose}
        >
            <Card
                className="w-full h-full !shadow-2xl"
                borderVariant="cyan"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-col h-full">
                    <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <h3 className="font-nunito text-lg font-bold text-calm-blue-200">Package Tracking</h3>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-calm-blue-300 hover:text-calm-blue-100 underline">
                                Open in new tab
                            </a>
                        </div>
                        <Button 
                            variant="ghost" 
                            onClick={onClose} 
                            className="px-1 py-1 h-8 w-8 text-slate-400 hover:text-slate-300"
                            aria-label="Close"
                        >
                            <XMarkIcon className="h-6 w-6"/>
                        </Button>
                    </div>
                    <div className="flex-grow bg-calm-indigo-950/30 rounded-b-xl relative">
                        <iframe
                            src={url}
                            title="Package Tracking"
                            className="w-full h-full border-0 relative z-10 bg-transparent"
                            sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                        ></iframe>
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                            <p className="text-slate-500 animate-pulse">Loading tracking information...</p>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};


export default function ShipmentTracker({ borderVariant }: { borderVariant?: BorderVariant }) {
  const [trackingInfo, setTrackingInfo] = useLocalStorage('shipmentTracking', initialTrackingInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTrackingInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const trackingUrl = trackingInfo.trackingNumber ? `${CARRIER_URLS[trackingInfo.carrier]}${trackingInfo.trackingNumber}` : '#';
  const customInputStyle = "w-full bg-calm-indigo-950/50 p-2 rounded-lg border border-calm-blue-400 focus:ring-2 focus:ring-calm-blue-400 placeholder-slate-400";

  return (
    <>
        <Card className="p-6" borderVariant={borderVariant}>
        <h3 className="font-nunito font-bold text-xl mb-4 text-calm-blue-200 tracking-wide">Next Shipment</h3>
        <div className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Carrier</label>
            <select name="carrier" value={trackingInfo.carrier} onChange={handleInputChange} className={`${customInputStyle} appearance-none`}>
                <option value="ups">UPS</option>
                <option value="fedex">FedEx</option>
                <option value="usps">USPS</option>
            </select>
            </div>
            <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tracking #</label>
            <input type="text" name="trackingNumber" value={trackingInfo.trackingNumber || ''} onChange={handleInputChange} className={customInputStyle} />
            </div>
            <Button onClick={() => setIsModalOpen(true)} disabled={!trackingInfo.trackingNumber} className="w-full">
                Track Package
            </Button>
        </div>
        </Card>
        <AnimatePresence>
            {isModalOpen && trackingInfo.trackingNumber && (
                <TrackingModal url={trackingUrl} onClose={() => setIsModalOpen(false)} />
            )}
        </AnimatePresence>
    </>
  );
}