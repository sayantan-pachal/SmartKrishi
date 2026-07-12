/* eslint-disable no-unused-vars */
import React from "react";

const DetailCard = React.memo(({ icon: Icon, label, value, iconColor, bg }) => (
    <div className={`p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-gray-50 dark:bg-white/[0.03] flex flex-col gap-2`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg} dark:bg-opacity-20`}>
            <Icon size={14} className={iconColor} />
        </div>
        <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-0.5">{label}</p>
            <p className="text-base font-bold text-[#111] dark:text-gray-100">{value || "N/A"}</p>
        </div>
    </div>
));

DetailCard.displayName = "DetailCard";
export default DetailCard;