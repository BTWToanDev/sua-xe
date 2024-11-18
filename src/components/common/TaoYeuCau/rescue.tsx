import { useState, useEffect } from "react";
import request from "/DoAn2/sua-xe/src/utils/request";
import { useNavigate } from "react-router-dom";

const Rescue = () => {
  const [mobilePhone, setMobilePhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [problems, setProblems] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [problemsList, setProblemsList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [showProblemsPopup, setShowProblemsPopup] = useState(false);
  const [showServicesPopup, setShowServicesPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch problems list
    request.get("/Problems")
      .then((response) => {
        setProblemsList(response.data);
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách Problems:", error));

    // Fetch services list
    request.get("/Services")
      .then((response) => {
        setServicesList(response.data);
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách Services:", error));
  }, []);

  const handleSave = async () => {
    try {
      const data = {
        mobilePhone,
        fullName,
        address,
        issueDescription,
        problems: problems.join(", "),
        services: services.join(", "),
      };

      await request.post("/ServiceRequests", data);

      navigate("/QuanLyYeuCau"); // Redirect to QuanLyYeuCau page
    } catch (error) {
      console.error("Lỗi khi tạo yêu cầu:", error);
    }
  };

  const handleProblemSelection = (problem: string) => {
    setProblems((prev) => (prev.includes(problem) ? prev : [...prev, problem]));
  };

  const handleServiceSelection = (service: string) => {
    setServices((prev) => (prev.includes(service) ? prev : [...prev, service]));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tạo Yêu Cầu</h2>
      <input
        type="text"
        placeholder="Mobile Phone"
        className="border p-2 mb-4 w-full"
        value={mobilePhone}
        onChange={(e) => setMobilePhone(e.target.value)}
      />
      <input
        type="text"
        placeholder="Full Name"
        className="border p-2 mb-4 w-full"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Address"
        className="border p-2 mb-4 w-full"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <textarea
        placeholder="Issue Description"
        className="border p-2 mb-4 w-full"
        value={issueDescription}
        onChange={(e) => setIssueDescription(e.target.value)}
      />
      <div className="mb-4">
        <label className="block font-bold mb-2">Problems</label>
        <button
          onClick={() => setShowProblemsPopup(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Chọn Problems
        </button>
        <div className="mt-2">
          {problems.map((problem, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg mr-2 inline-block"
            >
              {problem}
            </span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Services</label>
        <button
          onClick={() => setShowServicesPopup(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Chọn Services
        </button>
        <div className="mt-2">
          {services.map((service, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg mr-2 inline-block"
            >
              {service}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => navigate("/QuanLyYeuCau")}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Lưu
        </button>
      </div>

      {/* Problems Popup */}
      {showProblemsPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-h-[80%] overflow-auto">
            <h3 className="text-xl font-bold mb-4">Chọn Problems</h3>
            <ul>
              {problemsList.map((problem: any) => (
                <li
                  key={problem.id}
                  onClick={() => {
                    handleProblemSelection(problem.name);
                    setShowProblemsPopup(false);
                  }}
                  className="cursor-pointer hover:bg-gray-100 p-2"
                >
                  {problem.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Services Popup */}
      {showServicesPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-h-[80%] overflow-auto">
            <h3 className="text-xl font-bold mb-4">Chọn Services</h3>
            <ul>
              {servicesList.map((service: any) => (
                <li
                  key={service.id}
                  onClick={() => {
                    handleServiceSelection(service.name);
                    setShowServicesPopup(false);
                  }}
                  className="cursor-pointer hover:bg-gray-100 p-2"
                >
                  {service.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rescue;
