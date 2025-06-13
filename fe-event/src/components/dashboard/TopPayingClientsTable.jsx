// src/components/dashboard/TopPayingClientsTable.jsx
import React from "react";

const TopPayingClientsTable = () => {
  // Dữ liệu mẫu (có thể thay thế bằng dữ liệu thực tế từ API sau này)
  const clients = [
    {
      id: 1,
      image: "/assets/images/profile/user-1.jpg",
      name: "Mark J. Freeman",
      role: "Prof. English",
      hourRate: "$150/hour",
      extraClasses: "+53",
      status: "Available",
      statusColor: "bg-teal-400 text-teal-500",
    },
    {
      id: 2,
      image: "/assets/images/profile/user-2.jpg",
      name: "Nina R. Oldman",
      role: "Prof. History",
      hourRate: "$150/hour",
      extraClasses: "+68",
      status: "In Class",
      statusColor: "bg-blue-500 text-blue-600",
    },
    {
      id: 3,
      image: "/assets/images/profile/user-3.jpg",
      name: "Arya H. Shah",
      role: "Prof. Maths",
      hourRate: "$150/hour",
      extraClasses: "+94",
      status: "Absent",
      statusColor: "bg-red-400 text-red-500",
    },
    {
      id: 4,
      image: "/assets/images/profile/user-4.jpg",
      name: "June R. Smith",
      role: "Prof. Arts",
      hourRate: "$150/hour",
      extraClasses: "+27",
      status: "Absent",
      statusColor: "bg-yellow-400 text-yellow-500",
    },
  ];

  return (
    <div className="col-span-2">
      <div className="card h-full">
        <div className="card-body">
          <h4 className="text-gray-500 text-lg font-semibold mb-5">
            Top Paying Clients
          </h4>
          <div className="relative overflow-x-auto">
            <table className="text-left w-full whitespace-nowrap text-sm text-gray-500">
              <thead>
                <tr className="text-sm">
                  <th scope="col" className="p-4 font-semibold">
                    Profile
                  </th>
                  <th scope="col" className="p-4 font-semibold">
                    Hour Rate
                  </th>
                  <th scope="col" className="p-4 font-semibold">
                    Extra classes
                  </th>
                  <th scope="col" className="p-4 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td className="p-4 text-sm">
                      <div className="flex gap-6 items-center">
                        <div className="h-12 w-12 inline-block">
                          <img
                            src={client.image}
                            alt={client.name}
                            className="rounded-full w-100"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-gray-500">
                          <h3 className="font-bold">{client.name}</h3>
                          <span className="font-normal">{client.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <h3 className="font-medium">{client.hourRate}</h3>
                    </td>
                    <td className="p-4">
                      <h3 className="font-medium text-teal-500">
                        {client.extraClasses}
                      </h3>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center py-2 px-4 rounded-3xl font-semibold ${client.statusColor}`}
                      >
                        {client.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPayingClientsTable;
