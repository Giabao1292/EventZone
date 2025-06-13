// src/components/dashboard/UpcomingSchedules.jsx
import React from "react";
import { Link } from "react-router-dom";

const UpcomingSchedules = () => {
  return (
    <div className="card">
      <div className="card-body">
        <h4 className="text-gray-500 text-lg font-semibold mb-5">
          Upcoming Schedules
        </h4>
        <ul className="timeline-widget relative">
          <li className="timeline-item flex relative overflow-hidden min-h-[70px]">
            <div className="timeline-time text-gray-500 text-sm min-w-[90px] py-[6px] pr-4 text-end">
              9:30 am
            </div>
            <div className="timeline-badge-wrap flex flex-col items-center">
              <div className="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-blue-600 my-[10px]"></div>
              <div className="timeline-badge-border block h-full w-[1px] bg-gray-100"></div>
            </div>
            <div className="timeline-desc py-[6px] px-4">
              <p className="text-gray-500 text-sm font-normal">
                Payment received from John Doe of $385.90
              </p>
            </div>
          </li>
          <li className="timeline-item flex relative overflow-hidden min-h-[70px]">
            <div className="timeline-time text-gray-500 min-w-[90px] py-[6px] text-sm pr-4 text-end">
              10:00 am
            </div>
            <div className="timeline-badge-wrap flex flex-col items-center">
              <div className="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-blue-300 my-[10px]"></div>
              <div className="timeline-badge-border block h-full w-[1px] bg-gray-100"></div>
            </div>
            <div className="timeline-desc py-[6px] px-4 text-sm">
              <p className="text-gray-500 font-semibold">New sale recorded</p>
              <Link to="#" className="text-blue-600">
                #ML-3467
              </Link>
            </div>
          </li>
          <li className="timeline-item flex relative overflow-hidden min-h-[70px]">
            <div className="timeline-time text-gray-500 min-w-[90px] text-sm py-[6px] pr-4 text-end">
              12:00 am
            </div>
            <div className="timeline-badge-wrap flex flex-col items-center">
              <div className="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-teal-500 my-[10px]"></div>
              <div className="timeline-badge-border block h-full w-[1px] bg-gray-100"></div>
            </div>
            <div className="timeline-desc py-[6px] px-4">
              <p className="text-gray-500 text-sm font-normal">
                Payment was made of $64.95 to Michael
              </p>
            </div>
          </li>
          <li className="timeline-item flex relative overflow-hidden min-h-[70px]">
            <div className="timeline-time text-gray-500 min-w-[90px] text-sm py-[6px] pr-4 text-end">
              9:30 am
            </div>
            <div className="timeline-badge-wrap flex flex-col items-center">
              <div className="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-yellow-500 my-[10px]"></div>
              <div className="timeline-badge-border block h-full w-[1px] bg-gray-100"></div>
            </div>
            <div className="timeline-desc py-[6px] px-4 text-sm">
              <p className="text-gray-500 font-semibold">New sale recorded</p>
              <Link to="#" className="text-blue-600">
                #ML-3467
              </Link>
            </div>
          </li>
          <li className="timeline-item flex relative overflow-hidden min-h-[70px]">
            <div className="timeline-time text-gray-500 text-sm min-w-[90px] py-[6px] pr-4 text-end">
              9:30 am
            </div>
            <div className="timeline-badge-wrap flex flex-col items-center">
              <div className="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-red-500 my-[10px]"></div>
              <div className="timeline-badge-border block h-full w-[1px] bg-gray-100"></div>
            </div>
            <div className="timeline-desc py-[6px] px-4">
              <p className="text-gray-500 text-sm font-semibold">
                New arrival recorded
              </p>
            </div>
          </li>
          <li className="timeline-item flex relative overflow-hidden">
            <div className="timeline-time text-gray-500 text-sm min-w-[90px] py-[6px] pr-4 text-end">
              12:00 am
            </div>
            <div className="timeline-badge-wrap flex flex-col items-center">
              <div className="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-teal-500 my-[10px]"></div>
              <div className="timeline-badge-border block h-full w-[1px] bg-gray-100"></div>
            </div>
            <div className="timeline-desc py-[6px] px-4">
              <p className="text-gray-500 text-sm font-normal">Payment Done</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UpcomingSchedules;
