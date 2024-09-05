import { Header } from "@/components/Header"
import { Calendar, DollarSign, Upload, Users } from "lucide-react"
import type React from "react"
import { useState } from "react"

// Define types for form data
type FormData = {
  projectName: string
  tagline: string
  logo: File | null
  websiteUrl: string
  description: string
  category: string
  tags: string[]
  pricingModel: string
  launchDate: string
  teamMembers: string
}

const UploadProject: React.FC = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    projectName: "",
    tagline: "",
    logo: null,
    websiteUrl: "",
    description: "",
    category: "",
    tags: [],
    pricingModel: "",
    launchDate: "",
    teamMembers: "",
  })

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, logo: e.target.files![0] }))
    }
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim())
    setFormData((prev) => ({ ...prev, tags }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log(formData)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Project Basics</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="projectName"
                placeholder="Project Name"
                className="w-full p-2 border rounded"
                value={formData.projectName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="tagline"
                placeholder="Tagline"
                className="w-full p-2 border rounded"
                value={formData.tagline}
                onChange={handleInputChange}
              />
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Upload size={20} />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
                {formData.logo && <span>{formData.logo.name}</span>}
              </div>
              <input
                type="url"
                name="websiteUrl"
                placeholder="Website URL"
                className="w-full p-2 border rounded"
                value={formData.websiteUrl}
                onChange={handleInputChange}
              />
            </div>
          </>
        )
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Detailed Information</h2>
            <div className="space-y-4">
              <textarea
                name="description"
                placeholder="Full project description"
                className="w-full p-2 border rounded h-32"
                value={formData.description}
                onChange={handleInputChange}
              />
              <select
                name="category"
                className="w-full p-2 border rounded"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                <option value="tech">Tech</option>
                <option value="design">Design</option>
                <option value="productivity">Productivity</option>
              </select>
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma-separated)"
                className="w-full p-2 border rounded"
                value={formData.tags.join(", ")}
                onChange={handleTagsChange}
              />
            </div>
          </>
        )
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Additional Details</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <DollarSign size={20} />
                <input
                  type="text"
                  name="pricingModel"
                  placeholder="Pricing Model"
                  className="w-full p-2 border rounded"
                  value={formData.pricingModel}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={20} />
                <input
                  type="date"
                  name="launchDate"
                  className="w-full p-2 border rounded"
                  value={formData.launchDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <input
                  type="text"
                  name="teamMembers"
                  placeholder="Team Members"
                  className="w-full p-2 border rounded"
                  value={formData.teamMembers}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header title="Upload" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl bg-white  mx-auto rounded-lg shadow-md p-6">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-1/3 h-2 rounded-full ${
                    s <= step ? "bg-blue-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm">Basics</span>
              <span className="text-sm">Details</span>
              <span className="text-sm">Additional</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="px-4 py-2 rounded hover:bg-gray-300"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Submit for Review
                </button>
              )}
            </div>
          </form>

          {/* Preview Section */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-bold">
                {formData.projectName || "Project Name"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {formData.tagline || "Project Tagline"}
              </p>
              <div className="flex items-center mt-4 space-x-2">
                {formData.logo && (
                  <img
                    src={URL.createObjectURL(formData.logo)}
                    alt="Project Logo"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-sm">
                    {formData.description.slice(0, 100)}...
                  </p>
                  <div className="mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UploadProject
