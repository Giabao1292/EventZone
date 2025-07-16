import React, { useEffect, useState } from "react";
import { fetchEventAdsRevenues } from "../../services/revenueService";
import dayjs from "dayjs";

const UpcomingSchedules = () => {
  const [schedules, setSchedules] = useState([]);

  const badgeColors = [
    "border-blue-600",
    "border-green-500",
    "border-yellow-500",
    "border-red-500",
    "border-teal-500",
    "border-purple-500",
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchEventAdsRevenues({ page: 0, size: 6 });
        setSchedules(res.content || []);
      } catch (error) {
        console.error("Failed to fetch schedules", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="text-gray-500 text-lg font-semibold mb-5">Event Ads</h4>

        <ul className="timeline-widget relative">
          {schedules.map((item, index) => {
            const colorClass = badgeColors[index % badgeColors.length];
            const formattedDate = dayjs(item.createdAt).format(
              "DD/MM/YYYY HH:mm"
            );

            return (
              <li
                key={item.eventAdsId || index}
                className="timeline-item flex relative overflow-hidden min-h-[70px]"
              >
                {/* Hiển thị ngày giờ */}
                <div className="timeline-time text-gray-500 text-sm min-w-[110px] py-[6px] pr-4 text-end">
                  {formattedDate}
                </div>

                {/* Dấu tròn màu */}
                <div className="timeline-badge-wrap flex flex-col items-center">
                  <div
                    className={`timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 ${colorClass} my-[10px]`}
                  ></div>
                  <div className="timeline-badge-border block h-full w-[1px] bg-gray-100"></div>
                </div>

                {/* Nội dung mô tả */}
                <div className="timeline-desc py-[6px] px-4">
                  <p className="text-gray-500 text-sm font-semibold">
                    {item.eventTitle}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Organized by {item.organizerName} –{" "}
                    <span className="text-blue-600 font-medium">
                      ${item.totalPrice?.toFixed(2)}
                    </span>
                  </p>
                </div>
              </li>
            );
          })}

          {schedules.length === 0 && (
            <li className="text-gray-400 text-sm text-center py-4">
              No schedules found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UpcomingSchedules;
