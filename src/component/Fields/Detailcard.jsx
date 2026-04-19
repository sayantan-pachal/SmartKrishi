/* eslint-disable no-unused-vars */
import React from "react";

const DetailCard = React.memo(({ icon: Icon, label, value, iconColor, bg }) => (
    <div className={`${bg} dark:bg-opacity-10 p-4 rounded-2xl flex flex-col gap-1.5`}>
        <Icon size={16} className={iconColor} />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        <span className="text-base font-bold text-gray-800 dark:text-gray-200">{value || "N/A"}</span>
    </div>
));

DetailCard.displayName = "DetailCard";
export default DetailCard;