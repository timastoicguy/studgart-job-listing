import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FiPlus , FiTrash } from "react-icons/fi";
import clsx from "clsx"; // For conditional styling

interface SidebarProps {
  showSidebar: boolean;
}

export default function Sidebar({ showSidebar }: SidebarProps) {
  const [technologies, setTechnologies] = useState<string[]>(["reactjs"]);

  // Handle adding a new select for technology
  const addTechnology = () => {
    if (technologies.includes("")) return; // Prevent adding an empty selection
    setTechnologies([...technologies, ""]);
  };

  // Handle changing technology for each select
  const handleTechnologyChange = (index: number, value: string) => {
    if (technologies.includes(value)) {
      alert("Công nghệ này đã được chọn."); // Notify user about the duplicate
      return;
    }
    const updatedTechnologies = [...technologies];
    updatedTechnologies[index] = value;
    setTechnologies(updatedTechnologies);
  };

  // Handle removing a technology from the list
  const removeTechnology = (index: number) => {
    const updatedTechnologies = technologies.filter((_, i) => i !== index);
    setTechnologies(updatedTechnologies);
  };

  const availableTechnologies = ["reactjs", "vuejs", "angular", "nodejs","Khác"]; // Added "NodeJS"

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
      <label className="block text-sm font-medium mb-1 text-slate-400">Ưu tiên hiển thị</label>
      {/* Radio Group */}
      <RadioGroup className="space-y-0 mb-4" defaultValue="all">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <label htmlFor="all">Tất cả công việc</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="urgent" id="urgent" />
          <label htmlFor="urgent">Tuyển gấp</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="latest" id="latest" />
          <label htmlFor="latest">Tin mới nhất</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="highSalary" id="highSalary" />
          <label htmlFor="highSalary">Lương cao nhất</label>
        </div>
      </RadioGroup>

      {/* Job Position Select */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-slate-400">Vị trí công việc</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Chọn vị trí" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frontend">Front-end Developer</SelectItem>
            <SelectItem value="backend">Back-end Developer</SelectItem>
            <SelectItem value="fullstack">Full-stack Developer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rank Select */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-slate-400">Cấp bậc</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Chọn cấp bậc" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="intern">Thực tập sinh</SelectItem>
            <SelectItem value="junior">Junior</SelectItem>
            <SelectItem value="senior">Senior</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-slate-400">Địa điểm</label>
        <input
          type="text"
          placeholder="Nhập địa điểm"
          className="w-full border border-gray-300 rounded-md p-2"
          defaultValue="Hồ Chí Minh"
        />
      </div>

      {/* Job Type Select */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-slate-400">Kiểu công việc</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Chọn kiểu công việc" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fulltime">Full-time</SelectItem>
            <SelectItem value="parttime">Part-time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Technology Select */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-slate-400">Công nghệ chính</label>
        {technologies.map((tech, index) => (
          <div key={index} className="flex items-center mb-2">
            <Select onValueChange={(value) => handleTechnologyChange(index, value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn công nghệ" />
              </SelectTrigger>
              <SelectContent>
                {availableTechnologies.map((technology) => (
                  <SelectItem
                    key={technology}
                    value={technology}
                    // Disable only for the dropdowns that are not the first one
                    disabled={index !== 0 && technologies.includes(technology)}
                  >
                    {technology}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              className="ml-2 text-red-500"
              onClick={() => removeTechnology(index)}
            >
              <FiTrash className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="flex justify-center mb-6">
        <button
          className="w-10 h-10 border-2 border-green-500 text-green-500 rounded-full flex items-center justify-center"
          onClick={addTechnology}
        >
          <FiPlus className="w-6 h-6" />
        </button>
      </div>

      {/* Apply Switch */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-400">Áp dụng</label>
        <Switch defaultChecked />
      </div>
    </div>
  );
}
