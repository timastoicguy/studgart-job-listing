/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import clsx from "clsx";
import { TotalTransChart } from "@/components/admin/TotalTransChart";
import { ManualTransChart } from "@components/admin/ManualTransChart";
import { MomoTransChart } from "@components/admin/MomoTransChart";
import { JobChart } from "@/components/admin/JobChart";
import { OverviewChart } from "@components/admin/OverviewChart";
import toast from "react-hot-toast";
import axios from "axios";
// Remove import for Redux
// import withAuthorization from "@/lib/utils/withAuthorization";


interface Account {
  role: string;
  name: string;
  total: number;
}

const AdminDashboard = () => {
  const [visibleForm, setVisibleForm] = useState<string>("TotalTrans");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalTrans, setTotalTrans] = useState([]);
  const [manualTrans, setManualTrans] = useState([]);
  const [momoTrans, setMomoTrans] = useState([]);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);  // New state for total jobs

  const fetchAccounts = async () => {
    try {
      const roles = ["job_seeker", "recruiter", "company"];
      const requests = roles.map((role) =>
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users?page=1&limit=10&role=${role}`)
      );
  
      const responses = await Promise.all(requests);
      const totalAccounts = responses.reduce((total, response) => total + response.data.data.totalDocs, 0);
      setTotalAccounts(totalAccounts);
  
      const fetchedAccounts = responses.map((response, index) => ({
        role: roles[index],
        name: roles[index].replace("_", " ").toUpperCase(),
        total: response.data.data.totalDocs,
      }));
  
      setAccounts(fetchedAccounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to fetch account data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments?page=1&limit=50`
      );
      const transactions = response.data.data.docs;
      const filteredTransactions = transactions.filter((trans: { amount: number; }) => trans.amount > 0);
      const manualTransactions = filteredTransactions.filter(
        (trans: { paymentMethod: string; }) => trans.paymentMethod === "manual"
      );
      const momoTransactions = filteredTransactions.filter(
        (trans: { paymentMethod: string; }) => trans.paymentMethod === "momo"
      );
console.log(transactions)
      setTotalTrans(filteredTransactions);
      setManualTrans(manualTransactions);
      setMomoTrans(momoTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transaction data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch the total number of jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/jobs?page=1&limit=10`
      );
      setTotalJobs(response.data.data.totalDocs);  // Set the total job count
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch job data.");
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
    fetchJobs();  // Call the fetchJobs function to retrieve job count
  }, []);

  const handleContainerClick = (formName: string) => {
    setVisibleForm(formName);
  };

  return (
    <div className="px-2 py-2 md:px-4 rounded-md">
      <div className="p-4  border-gray-700 select-none">
        <div className="w-full grid lg:grid-cols-8 md:grid-cols-4 grid-cols-2 gap-4 mb-4">
          <div className="lg:col-span-2 md:col-span-4 col-span-2 rounded-md">
            <OverviewChart  accounts={accounts}  />
          </div>

          <div className="lg:col-span-6 md:col-span-4 col-span-2">
            <div className="bg-white rounded-md">
              <div className="flex items-center justify-between px-3 border-b">
                <h3 className="text-black text-2xl font-bold px-2">Revenue</h3>
                <div className="flex items-center w-full justify-end">
                  <div className="flex gap-2 py-1 items-center">
                    <button
                      className={clsx(
                        "p-2 border-r hover:bg-slate-200 text-center",
                        {
                          "bg-gray-200": visibleForm === "TotalTrans",
                        }
                      )}
                      onClick={() => handleContainerClick("TotalTrans")}
                    >
                      <span>Total</span>
                    </button>
                    <button
                      className={clsx(
                        "p-2 border-r hover:bg-slate-200 text-center",
                        {
                          "bg-gray-200": visibleForm === "ManualTrans",
                        }
                      )}
                      onClick={() => handleContainerClick("ManualTrans")}
                    >
                      Manual
                    </button>
                    <button
                      className={clsx("p-2 hover:bg-slate-200 text-center", {
                        "bg-gray-200": visibleForm === "MomoTrans",
                      })}
                      onClick={() => handleContainerClick("MomoTrans")}
                    >
                      Momo
                    </button>
                  </div>
                </div>
              </div>

              <div>
                {visibleForm === "TotalTrans" && (
                  <TotalTransChart data={totalTrans} />
                )}
                {visibleForm === "ManualTrans" && (
                  <ManualTransChart data={manualTrans} />
                )}
                {visibleForm === "MomoTrans" && (
                  <MomoTransChart data={momoTrans} />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg p-4 lg:col-span-2 md:col-span-2 col-span-1 rounded-md">
            <div>
              <h3 className="w-full border-b text-left mb-4 text-lg font-bold">
                TotalTrans{" "}
                <span className="text-sm text-gray-300 font-normal">
                  this month
                </span>
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold">
                {totalTrans.length}
              </div>
              <div className="text-sm text-gray-500">Total Transations</div>
            </div>
          </div>

          <div className="bg-white shadow-lg p-4 lg:col-span-2 md:col-span-2 col-span-1 rounded-md">
            <div>
              <h3 className="w-full border-b text-left mb-4 text-lg font-bold">
                ManualTrans{" "}
                <span className="text-sm text-gray-300 font-normal">
                  this month
                </span>
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold">
                {manualTrans.length}
              </div>
              <div className="text-sm text-gray-500">Manual Transations</div>
            </div>
          </div>

          <div className="bg-white shadow-lg p-4 lg:col-span-2 md:col-span-2 col-span-1 rounded-md">
            <div>
              <h3 className="w-full border-b text-left mb-4 text-lg font-bold">
                MomoTrans{" "}
                <span className="text-sm text-gray-300 font-normal">
                  this month
                </span>
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold">
                {momoTrans.length}
              </div>
              <div className="text-sm text-gray-500">Momo Transations</div>
            </div>
          </div>

          <div className="bg-white shadow-lg p-4 lg:col-span-1 md:col-span-2 col-span-1 rounded-md">
            <div>
              <h3 className="w-full border-b text-left mb-4 text-lg font-bold">
                ACCOUNTS
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold">
                {totalAccounts}
              </div>
              <div className="text-sm text-gray-500">Total Acconts</div>
            </div>
          </div>

          <div className="bg-white shadow-lg p-4 lg:col-span-1 col-span-2 rounded-md">
            <div>
              <h3 className="w-full border-b text-left mb-4 text-lg font-bold">
                JOBS
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold">
              {totalJobs}
              </div>
              <div className="text-sm text-gray-500">Total Jobs</div>
            </div>
          </div>

          <div className="lg:col-span-8 md:col-span-4 col-span-2">
            <JobChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
