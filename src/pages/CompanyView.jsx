import React from "react";
import { useParams } from "react-router-dom";
import { getCompanyById } from "../api/companyApi";
import {
  Building2,
  Plus,
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Tag,
  X,
  Upload,
  ChevronDown,
  ChevronUp,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";

const CompanyView = () => {
  const { id } = useParams();
  const [company, setCompany] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const fetchCompany = async () => {
    try {
      setLoading(true);
      const res = await getCompanyById(id);
      setCompany(res.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Fecth failed", error);
    }
  };
  React.useEffect(() => {
    fetchCompany();
  }, [id]);
  return (
    <>
      <div className="bg-white p-4 rounded shadow h-full">
        <div className="p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{company.name}</h2>
              <p className="text-sm text-gray-500">{company.industry}</p>
            </div>
          </div>
          <Link
            to="/company"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Companies
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{company.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{company.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span>{company.website || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Company Details
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600">Size:</span>
                      <span className="ml-2 font-medium">
                        {company.companySize || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                          company.status === "customer"
                            ? "bg-green-100 text-green-800"
                            : company.status === "lead"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {company.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-medium capitalize">
                        {company.type || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {company.address && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Address
                    </h3>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        {company.address && <p>{company.address}</p>}
                        {company.state && <p>{company.state} </p>}
                        {company.country && <p>{company.country}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {company.description && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700">{company.description}</p>
                  </div>
                )}

                {company.tags && company.tags.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {company.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CompanyView;
