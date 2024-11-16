/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiPlus, FiTrash } from "react-icons/fi";
import clsx from "clsx";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  showSidebar: boolean;
}

export default function Sidebar({ showSidebar }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Filter state variables
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("latest");
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("all");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("all");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [employmentType, setEmploymentType] = useState("all");
  const [minSalary, setMinSalary] = useState<number | undefined>(undefined);
  const [maxSalary, setMaxSalary] = useState<number | undefined>(undefined);

  const techInputRef = useRef<HTMLInputElement>(null);

  const addTechnology = () => {
    const tech = techInputRef.current?.value.trim().toUpperCase();
    if (tech && !technologies.includes(tech)) {
      setTechnologies([...technologies, tech]);
      techInputRef.current!.value = "";
    }
  };


  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((item) => item !== tech));
  };

  const handleFetchJobs = () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      search,
      company,
      ...(category !== "all" && { category }),
      ...(locationFilter !== "all" && { location: locationFilter }),
      ...(experienceLevel !== "all" && { experienceLevel }),
      ...(employmentType !== "all" && { employmentType }),
      minSalary: minSalary?.toString() ?? "",
      maxSalary: maxSalary?.toString() ?? "",
      technologies: technologies.join(","),
    });
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div
      className={clsx(
        "fixed flex flex-col w-[250px] h-[calc(100vh)] top-[60px] z-40 bg-white shadow-md transition-all duration-300",
        {
          "-left-[250px] lg:left-0 pl-3 pr-3": !showSidebar,
          "left-0 shadow-black shadow-lg lg:shadow-none pl-3 pr-3": showSidebar,
        }
      )}
    >
      <h2 className="font-semibold text-lg mb-4 mt-6">Bộ lọc</h2>

        {/* Sort Options */}
        <div className="mb-4">
          <RadioGroup onValueChange={setSort}>
            <label className="block text-sm font-medium mb-1 text-slate-400">Sắp xếp</label>
            <div className="flex flex-col gap-2">
              {[
                { value: "latest", label: "Mới nhất" },
                { value: "highestSalary", label: "Lương cao nhất" },
                { value: "urgent", label: " Tuyển gấp" },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center">
                  <RadioGroupItem value={value} id={value} />
                  <span className="ml-2">{label}</span>
                </label>
              ))}
            </div>
          </RadioGroup>
        </div>


      {/* Company Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-slate-400">Tìm kiếm</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tên công việc"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-slate-400">Ngành nghề</label>
        <Select onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn ngành nghề" />
          </SelectTrigger>
          <SelectContent>
            {["all", "it", "marketing", "finance"].map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Experience Level Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-slate-400">Kinh nghiệm</label>
        <Select onValueChange={setExperienceLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn kinh nghiệm" />
          </SelectTrigger>
          <SelectContent>
            {["all", "mid", "senior", "lead"].map((exp) => (
              <SelectItem key={exp} value={exp}>
                {exp.charAt(0).toUpperCase() + exp.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Technologies Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-slate-400">Công nghệ</label>
        <div className="flex items-center">
          <input
            type="text"
            ref={techInputRef}
            placeholder="Thêm công nghệ"
            className="w-full p-2 border rounded "
            onKeyDown={(e) => e.key === "Enter" && addTechnology()}
          />
          <button type="button" onClick={addTechnology} className="ml-2 ">
            <FiPlus />
          </button>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {technologies.map((tech) => (
            <div key={tech} className="flex items-center bg-gray-200 p-1 rounded hover:bg-gray-300">
              <span>{tech}</span>
              <button type="button" onClick={() => removeTechnology(tech)} className="ml-2 text-red-500">
                <FiTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Filters */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-slate-400">Mức lương</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={minSalary ?? ""}
            onChange={(e) => setMinSalary(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Tối thiểu"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            value={maxSalary ?? ""}
            onChange={(e) => setMaxSalary(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Tối đa"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleFetchJobs}
        className="bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600 transition"
      >
        Tìm kiếm
      </button>
    </div>
  );
}
