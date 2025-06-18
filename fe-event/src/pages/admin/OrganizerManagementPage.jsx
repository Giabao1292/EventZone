"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  forwardRef,
} from "react";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  FileText,
  Award,
  Loader2,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// Import API functions
import {
  getOrganizers,
  getOrganizerDetails,
  getOrganizerTypes,
  updateOrganizerStatus,
} from "../../services/organizerService";

// Custom hooks defined inline
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return isMobile;
};

const useToast = () => {
  const toast = ({ title, description, variant = "default" }) => {
    const toastElement = document.createElement("div");
    toastElement.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 max-w-sm ${
      variant === "destructive"
        ? "bg-red-500 text-white border border-red-600"
        : "bg-green-500 text-white border border-green-600"
    }`;
    toastElement.innerHTML = `
      <div class="font-semibold">${title}</div>
      <div class="text-sm opacity-90">${description}</div>
    `;

    document.body.appendChild(toastElement);

    setTimeout(() => {
      if (document.body.contains(toastElement)) {
        document.body.removeChild(toastElement);
      }
    }, 4000);
  };

  return { toast };
};
// UI Components defined inline
const Button = forwardRef(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

    const variants = {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90 bg-slate-900 text-white hover:bg-slate-800",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 bg-red-500 text-white hover:bg-red-600",
      outline:
        "border border-input hover:bg-accent hover:text-accent-foreground border-slate-200 hover:bg-slate-100",
      ghost: "hover:bg-accent hover:text-accent-foreground hover:bg-slate-100",
    };

    const sizes = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md",
      lg: "h-11 px-8 rounded-md",
    };

    return (
      <button
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

const Input = forwardRef(({ className = "", type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-slate-200 focus-visible:ring-slate-400 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

const Select = ({ children, value, onValueChange, ...props }) => {
  return (
    <SelectProvider value={value} onValueChange={onValueChange}>
      {children}
    </SelectProvider>
  );
};

const SelectContext = createContext();
const SelectProvider = ({ children, value, onValueChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      {children}
    </SelectContext.Provider>
  );
};

const SelectTrigger = ({ children, className = "" }) => {
  const { value, open, setOpen } = useContext(SelectContext);
  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-slate-200 ${className}`}
      onClick={() => setOpen(!open)}
    >
      {children}
      <ChevronRight
        className={`h-4 w-4 opacity-50 transition-transform ${
          open ? "rotate-90" : ""
        }`}
      />
    </button>
  );
};

const SelectValue = ({ placeholder }) => {
  const { value } = useContext(SelectContext);
  return <span>{value || placeholder}</span>;
};

const SelectContent = ({ children }) => {
  const { open } = useContext(SelectContext);
  if (!open) return null;

  return (
    <div className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 bg-white border-slate-200 shadow-lg">
      {children}
    </div>
  );
};

const SelectItem = ({ children, value }) => {
  const { onValueChange, setOpen } = useContext(SelectContext);

  return (
    <div
      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-slate-100 cursor-pointer"
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
    >
      {children}
    </div>
  );
};

const Table = ({ children, className = "" }) => (
  <div className="w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className}`}>
      {children}
    </table>
  </div>
);

const TableHeader = ({ children }) => (
  <thead className="[&_tr]:border-b border-slate-200">{children}</thead>
);

const TableBody = ({ children }) => (
  <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
);

const TableRow = ({ children, className = "" }) => (
  <tr
    className={`border-b transition-colors hover:bg-muted/50 border-slate-200 hover:bg-slate-50 ${className}`}
  >
    {children}
  </tr>
);

const TableHead = ({ children, className = "" }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-slate-600 ${className}`}
  >
    {children}
  </th>
);

const TableCell = ({ children, className = "" }) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>
    {children}
  </td>
);

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg bg-white border-slate-200">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

const DialogHeader = ({ children }) => (
  <div className="flex flex-col space-y-1.5 text-center sm:text-left">
    {children}
  </div>
);

const DialogTitle = ({ children }) => (
  <h3 className="text-lg font-semibold leading-none tracking-tight">
    {children}
  </h3>
);

const DialogDescription = ({ children }) => (
  <p className="text-sm text-muted-foreground text-slate-600">{children}</p>
);

const DialogFooter = ({ children }) => (
  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
    {children}
  </div>
);

const Drawer = ({ children, open, onOpenChange }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background bg-white border-slate-200">
        {children}
      </div>
    </div>
  );
};

const DrawerContent = ({ children, className = "" }) => (
  <div className={`flex flex-col ${className}`}>{children}</div>
);

const DrawerHeader = ({ children }) => (
  <div className="grid gap-1.5 p-4 text-center sm:text-left">{children}</div>
);

const DrawerTitle = ({ children }) => (
  <h3 className="text-lg font-semibold leading-none tracking-tight">
    {children}
  </h3>
);

const DrawerDescription = ({ children }) => (
  <p className="text-sm text-muted-foreground text-slate-600">{children}</p>
);

const Tabs = ({ children, defaultValue, className = "" }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsProvider value={activeTab} onValueChange={setActiveTab}>
      <div className={className}>{children}</div>
    </TabsProvider>
  );
};

const TabsContext = createContext();
const TabsProvider = ({ children, value, onValueChange }) => (
  <TabsContext.Provider value={{ value, onValueChange }}>
    {children}
  </TabsContext.Provider>
);

const TabsList = ({ children, className = "" }) => (
  <div
    className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground bg-slate-100 ${className}`}
  >
    {children}
  </div>
);

const TabsTrigger = ({ children, value }) => {
  const { value: activeValue, onValueChange } = useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? "bg-background text-foreground shadow-sm bg-white text-slate-900"
          : "text-slate-600 hover:text-slate-900"
      }`}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value }) => {
  const { value: activeValue } = useContext(TabsContext);
  if (activeValue !== value) return null;

  return (
    <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      {children}
    </div>
  );
};

const Tooltip = ({ children }) => {
  return <TooltipProvider>{children}</TooltipProvider>;
};

const TooltipProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </TooltipContext.Provider>
  );
};

const TooltipContext = createContext();

const TooltipTrigger = ({ children, asChild }) => {
  const { setOpen } = useContext(TooltipContext);

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
    </div>
  );
};

const TooltipContent = ({ children }) => {
  const { open } = useContext(TooltipContext);
  if (!open) return null;

  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-50">
      {children}
    </div>
  );
};

const Badge = ({ children, className = "" }) => (
  <div
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${className}`}
  >
    {children}
  </div>
);

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-slate-200 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
  >
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Alert = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-background text-foreground border-slate-200",
    destructive:
      "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive border-red-200 text-red-800 bg-red-50",
  };

  return (
    <div
      className={`relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7 ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

const AlertDescription = ({ children, className = "" }) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`}>{children}</div>
);

export default function OrganizerManagementPage() {
  // State management
  const [organizers, setOrganizers] = useState([]);
  const [organizerTypes, setOrganizerTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Search and filter states
  const [searchFilters, setSearchFilters] = useState({
    orgName: "",
    status: "",
    typeCode: "",
    email: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Sorting states
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  // Modal states
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: "",
    organizer: null,
  });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [organizerDetails, setOrganizerDetails] = useState(null);

  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Fetch organizers data
  const fetchOrganizers = async (
    page = 0,
    filters = searchFilters,
    sort = sortBy,
    direction = sortDirection
  ) => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = {};
      if (filters.orgName) searchParams.orgName = filters.orgName;
      if (filters.status && filters.status !== "ALL")
        searchParams.status = filters.status;
      if (filters.typeCode && filters.typeCode !== "ALL")
        searchParams.typeCode = filters.typeCode;
      if (filters.email) searchParams.email = filters.email;

      const response = await getOrganizers(page, pageSize, sort, searchParams);

      if (response.code === 200) {
        setOrganizers(response.data.content || []);
        setTotalElements(response.data.totalElements || 0);
        setTotalPages(response.data.totalPages || 0);
        setCurrentPage(response.data.number || 0);
      } else {
        throw new Error(response.message || "Failed to fetch organizers");
      }
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch organizer types
  const fetchOrganizerTypes = async () => {
    try {
      const response = await getOrganizerTypes();
      if (response.code === 200) {
        setOrganizerTypes(response.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch organizer types:", err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrganizers();
    fetchOrganizerTypes();
  }, []);

  // Handle search filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...searchFilters, [key]: value };
    setSearchFilters(newFilters);
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(0);
    fetchOrganizers(0, searchFilters, sortBy, sortDirection);
  };

  // Clear filters
  const clearFilters = () => {
    const emptyFilters = { orgName: "", status: "", typeCode: "", email: "" };
    setSearchFilters(emptyFilters);
    setCurrentPage(0);
    fetchOrganizers(0, emptyFilters, sortBy, sortDirection);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchOrganizers(newPage, searchFilters, sortBy, sortDirection);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
    fetchOrganizers(0, searchFilters, sortBy, sortDirection);
  };

  // Handle sorting
  const handleSort = (column) => {
    let newDirection = "asc";
    if (sortBy === column && sortDirection === "asc") {
      newDirection = "desc";
      column = "";
    }

    setSortBy(column);
    setSortDirection(newDirection);
    fetchOrganizers(currentPage, searchFilters, column, newDirection);
  };

  // Get sort icon
  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="w-4 h-4 ml-1" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  // Handle status change (approve/reject)
  const handleStatusChange = async (organizer, newStatus) => {
    try {
      setStatusUpdateLoading(true);

      const response = await updateOrganizerStatus(organizer.id, newStatus);

      if (response.code === 200) {
        toast({
          title: "Success",
          description: `Organizer ${newStatus.toLowerCase()} successfully`,
        });

        // Refresh the current page
        fetchOrganizers(currentPage, searchFilters, sortBy, sortDirection);
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setStatusUpdateLoading(false);
      setConfirmDialog({ open: false, type: "", organizer: null });
    }
  };

  // Open confirmation dialog
  const openConfirmDialog = (type, organizer) => {
    setConfirmDialog({ open: true, type, organizer });
  };

  // Fetch and open organizer details
  const openDetails = async (organizer) => {
    try {
      setDetailsLoading(true);
      setSelectedOrganizer(organizer);
      setDetailsOpen(true);

      const response = await getOrganizerDetails(organizer.id);

      if (response.code === 200) {
        setOrganizerDetails(response.data);
      } else {
        throw new Error(
          response.message || "Failed to fetch organizer details"
        );
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const variants = {
      PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      APPROVED: "bg-green-100 text-green-800 hover:bg-green-100",
      REJECTED: "bg-red-100 text-red-800 hover:bg-red-100",
    };

    return (
      <Badge className={variants[status] || variants.PENDING}>{status}</Badge>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Details content component
  const DetailsContent = ({ organizer, details }) => {
    if (detailsLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading details...</span>
        </div>
      );
    }

    if (!details) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load organizer details.</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="p-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={
                  details.orgLogoUrl || "/placeholder.svg?height=100&width=100"
                }
                alt="Organization Logo"
                className="w-16 h-16 rounded-lg object-cover border cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() =>
                  openImageModal(
                    details.orgLogoUrl ||
                      "/placeholder.svg?height=100&width=100",
                    "Organization Logo"
                  )
                }
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=100&width=100";
                }}
              />
              <div>
                <h3 className="text-lg font-semibold">
                  {details.orgName || organizer.orgName}
                </h3>
                <p className="text-sm text-slate-600">{organizer.orgType}</p>
                {details.website && (
                  <a
                    href={details.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {details.website}
                  </a>
                )}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Business Field
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {details.businessField || "Not specified"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Organization Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {details.orgInfo || "No information provided"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {details.experience || "No experience information provided"}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Business License</CardTitle>
                </CardHeader>
                <CardContent>
                  {details.businessLicenseUrl ? (
                    <div className="relative group">
                      <img
                        src={details.businessLicenseUrl || "/placeholder.svg"}
                        alt="Business License"
                        className="w-full max-w-2xl rounded-lg border cursor-pointer hover:shadow-lg transition-shadow duration-300"
                        onClick={() =>
                          openImageModal(
                            details.businessLicenseUrl || "/placeholder.svg",
                            "Business License"
                          )
                        }
                        onError={(e) => {
                          e.target.src =
                            "/placeholder.svg?height=200&width=300";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">
                      No business license uploaded
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>ID Card - Front</CardTitle>
                </CardHeader>
                <CardContent>
                  {details.idCardFrontUrl ? (
                    <div className="relative group">
                      <img
                        src={details.idCardFrontUrl || "/placeholder.svg"}
                        alt="ID Card Front"
                        className="w-full max-w-2xl rounded-lg border cursor-pointer hover:shadow-lg transition-shadow duration-300"
                        onClick={() =>
                          openImageModal(
                            details.idCardFrontUrl || "/placeholder.svg",
                            "ID Card Front"
                          )
                        }
                        onError={(e) => {
                          e.target.src =
                            "/placeholder.svg?height=200&width=300";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">
                      No ID card front uploaded
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ID Card - Back</CardTitle>
                </CardHeader>
                <CardContent>
                  {details.idCardBackUrl ? (
                    <div className="relative group">
                      <img
                        src={details.idCardBackUrl || "/placeholder.svg"}
                        alt="ID Card Back"
                        className="w-full max-w-2xl rounded-lg border cursor-pointer hover:shadow-lg transition-shadow duration-300"
                        onClick={() =>
                          openImageModal(
                            details.idCardBackUrl || "/placeholder.svg",
                            "ID Card Back"
                          )
                        }
                        onError={(e) => {
                          e.target.src =
                            "/placeholder.svg?height=200&width=300";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">
                      No ID card back uploaded
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          Organizer Registration Requests
        </h1>

        {/* Search Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Organization Name
                </label>
                <Input
                  placeholder="Search by organization name..."
                  value={searchFilters.orgName}
                  onChange={(e) =>
                    handleFilterChange("orgName", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={searchFilters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Type
                </label>
                <select
                  value={searchFilters.typeCode}
                  onChange={(e) =>
                    handleFilterChange("typeCode", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Types</option>
                  {organizerTypes.map((type) => (
                    <option key={type.typeCode} value={type.typeCode}>
                      {type.typeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input
                  placeholder="Search by email..."
                  value={searchFilters.email}
                  onChange={(e) => handleFilterChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={applyFilters} disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={loading}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Table */}
      <div className="rounded-md bg-white border border-slate-200">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading organizers...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("orgName")}
                    className="h-auto p-0 font-semibold"
                  >
                    Organization
                    {getSortIcon("orgName")}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button variant="ghost" className="h-auto p-0 font-semibold">
                    Type
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <Button variant="ghost" className="h-auto p-0 font-semibold">
                    Representative
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <Button variant="ghost" className="h-auto p-0 font-semibold">
                    Email
                  </Button>
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  <Button
                    variant="ghost"
                    // onClick={() => handleSort("createdAt")}
                    className="h-auto p-0 font-semibold"
                  >
                    Date
                    {/* {getSortIcon("createdAt")} */}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    // onClick={() => handleSort("status")}
                    className="h-auto p-0 font-semibold"
                  >
                    Status
                    {/* {getSortIcon("status")} */}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No organizers found
                  </TableCell>
                </TableRow>
              ) : (
                organizers.map((organizer, index) => (
                  <TableRow key={organizer.email || index}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{organizer.orgName}</div>
                        <div className="text-sm text-slate-600 md:hidden">
                          {organizer.orgType}
                        </div>
                        <div className="text-sm text-slate-600 lg:hidden">
                          {organizer.fullName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {organizer.orgType}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {organizer.fullName}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {organizer.email}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatDate(organizer.createdAt)}
                    </TableCell>
                    <TableCell>{getStatusBadge(organizer.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDetails(organizer)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>

                        {organizer.status === "PENDING" && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() =>
                                    openConfirmDialog("approve", organizer)
                                  }
                                  disabled={statusUpdateLoading}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Approve</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() =>
                                    openConfirmDialog("reject", organizer)
                                  }
                                  disabled={statusUpdateLoading}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Reject</TooltipContent>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Show</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) =>
                handlePageSizeChange(Number.parseInt(value))
              }
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-slate-600">entries</span>
          </div>

          <p className="text-sm text-slate-600">
            Showing {currentPage * pageSize + 1} to{" "}
            {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
            {totalElements} results
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0 || loading}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <span className="text-sm">
              Page {currentPage + 1} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1 || loading}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === "approve" ? "Approve" : "Reject"}{" "}
              Registration
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmDialog.type} the registration
              request from <strong>{confirmDialog.organizer?.orgName}</strong>?
              {confirmDialog.type === "reject" &&
                " This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({ open: false, type: "", organizer: null })
              }
              disabled={statusUpdateLoading}
            >
              Cancel
            </Button>
            <Button
              variant={
                confirmDialog.type === "approve" ? "default" : "destructive"
              }
              onClick={() =>
                handleStatusChange(
                  confirmDialog.organizer,
                  confirmDialog.type === "approve" ? "APPROVED" : "REJECTED"
                )
              }
              disabled={statusUpdateLoading}
            >
              {statusUpdateLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {confirmDialog.type === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Drawer/Dialog */}
      {isMobile ? (
        <Drawer open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader>
              <DrawerTitle>{selectedOrganizer?.orgName}</DrawerTitle>
              <DrawerDescription>
                Registration details and verification documents
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4 overflow-y-auto">
              {selectedOrganizer && (
                <DetailsContent
                  organizer={selectedOrganizer}
                  details={organizerDetails}
                />
              )}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedOrganizer?.orgName}</DialogTitle>
              <DialogDescription>
                Registration details and verification documents
              </DialogDescription>
            </DialogHeader>
            {selectedOrganizer && (
              <DetailsContent
                organizer={selectedOrganizer}
                details={organizerDetails}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
