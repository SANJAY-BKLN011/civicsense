import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus,
  MapPin,
  Crosshair,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  Trash2,
  RefreshCw,
  Info,
  Calendar,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDepartments } from '../../context/DepartmentContext';
import { useOfficerComplaints } from '../../context/OfficerComplaintsContext';
import { useAdminComplaints } from '../../context/AdminComplaintsContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Select,
  Button,
  Badge,
  ErrorMessage,
} from '../../components/ui';

export function CitizenReport() {
  const { user } = useAuth();
  const { departments, isLoading: isDeptsLoading, error: deptsError, refetchDepartments } = useDepartments();
  const { addComplaint: addOfficerComplaint } = useOfficerComplaints();
  const { addComplaint: addAdminComplaint } = useAdminComplaints();
  const { addNotification } = useNotifications();

  // Department Options dynamically generated from backend / DepartmentContext
  const departmentOptions = departments.map((d, index) => ({
    value: d.id,
    label: `${index + 1}. ${d.name}`,
  }));
  departmentOptions.push({
    value: 'other',
    label: `${departmentOptions.length + 1}. Other / Not Sure (Auto-triage)`,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Field States
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [ward, setWard] = useState(user?.ward || 'Ward 12 - Central District');

  // Photo Upload States
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Location Geolocation States
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Validation and Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Screen State
  const [submittedData, setSubmittedData] = useState<{
    id: string;
    title: string;
    department: string;
    location: string;
    date: string;
    photoPreview: string | null;
  } | null>(null);

  // Photo selection handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPhotoError('Please upload a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError('Image file size exceeds 10MB. Please choose a smaller photo.');
      return;
    }

    setPhotoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleRemovePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Location detection handler
  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser. Using mock GPS location.');
      setCoordinates({ lat: 12.9716, lng: 77.5946 });
      if (!manualLocation) setManualLocation('Near Central Market, Main Road');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: parseFloat(position.coords.latitude.toFixed(6)),
          lng: parseFloat(position.coords.longitude.toFixed(6)),
        });
        if (!manualLocation) {
          setManualLocation('Current GPS Location Marker');
        }
        setIsLocating(false);
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? 'Location permission denied. Mock coordinates have been applied for testing.'
            : 'Unable to acquire precise GPS signal. Mock coordinates applied.'
        );
        setCoordinates({ lat: 12.9716, lng: 77.5946 });
        if (!manualLocation) {
          setManualLocation('Central District Hub, Ward 12');
        }
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Form Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Issue Title is required.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Issue Title must be at least 5 characters.';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Issue Title cannot exceed 100 characters.';
    }

    if (!department) {
      newErrors.department = 'Please select a responsible department.';
    }

    if (!description.trim()) {
      newErrors.description = 'Issue description is required.';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Please provide a more detailed description (at least 10 characters).';
    } else if (description.trim().length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters.';
    }

    if (!manualLocation.trim()) {
      newErrors.manualLocation = 'Street address or location landmark is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      setFormError('Please resolve the errors highlighted below before submitting.');
      return;
    }

    setIsSubmitting(true);
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const mockId = `CIV-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const fullFormattedDate = `${formattedDate}, ${formattedTime}`;

    const locationStr = coordinates
      ? `${manualLocation.trim()} (GPS: ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)})`
      : manualLocation.trim();

    // Create Officer complaint record
    addOfficerComplaint({
      id: mockId,
      title: title.trim(),
      category: 'Sanitation & Waste',
      department,
      location: locationStr,
      ward: ward || 'Ward 12 - Central District',
      submittedDate: formattedDate,
      submittedTime: formattedTime,
      citizenName: user?.name || 'Sanjay Patel',
      status: 'NEW',
      priority: 'Medium',
      thumbnailIcon: '📌',
      description: description.trim(),
      coordinates: coordinates || { lat: 12.9716, lng: 77.5946 },
      timeline: [
        {
          id: `tl-sub-${Date.now()}`,
          timestamp: `${formattedDate} at ${formattedTime}`,
          title: 'Complaint Submitted',
          description: 'Issue reported by citizen and logged into central triage system.',
          author: user?.name || 'Sanjay Patel',
          type: 'submission',
        },
      ],
    });

    // Create Admin complaint record
    addAdminComplaint({
      id: mockId,
      title: title.trim(),
      category: 'Sanitation & Waste',
      department,
      location: locationStr,
      ward: ward || 'Ward 12 - Central District',
      submittedDate: formattedDate,
      submittedTime: formattedTime,
      citizenName: user?.name || 'Sanjay Patel',
      assignedOfficer: 'Officer Sanjay Kumar',
      assignedOfficerId: 'OFF-SAN-402',
      status: 'NEW',
      priority: 'Medium',
      thumbnailIcon: '📌',
      description: description.trim(),
      coordinates: coordinates || { lat: 12.9716, lng: 77.5946 },
    });

    // Push Notifications for Citizen & Officer
    addNotification({
      role: 'citizen',
      title: `Complaint Submitted (${mockId})`,
      message: `Your complaint "${title.trim()}" has been received and logged under ID ${mockId}.`,
      complaintId: mockId,
      type: 'submitted',
    });

    addNotification({
      role: 'officer',
      title: `New Case Assigned (${mockId})`,
      message: `A new complaint "${title.trim()}" in ${department} requires triage.`,
      complaintId: mockId,
      type: 'assigned',
    });

    setSubmittedData({
      id: mockId,
      title: title.trim(),
      department,
      location: locationStr,
      date: fullFormattedDate,
      photoPreview,
    });

    setIsSubmitting(false);
  };

  const handleResetForm = () => {
    setTitle('');
    setDepartment('');
    setDescription('');
    setManualLocation('');
    setCoordinates(null);
    handleRemovePhoto();
    setSubmittedData(null);
    setErrors({});
    setFormError(null);
  };

  // SUCCESS SCREEN
  if (submittedData) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-8 animate-in fade-in duration-300">
        <Card className="border-2 border-emerald-300 shadow-lg text-center overflow-hidden">
          <div className="bg-emerald-600 p-8 text-white flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-3">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Complaint Submitted Successfully!
            </h2>
            <p className="text-sm text-emerald-100 mt-1 max-w-md">
              Your civic issue has been logged and routed to the department triage queue.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6 text-left">
            {/* Tracking ID Hero Box */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Complaint Tracking ID
                </span>
                <span className="font-mono text-2xl font-bold text-slate-900">
                  {submittedData.id}
                </span>
                <p className="text-xs font-semibold text-blue-700 mt-1">
                  Save this ID to track your complaint.
                </p>
              </div>
              <div className="sm:text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Current Status
                </span>
                <Badge variant="NEW" dot>
                  NEW (Queued for Triage)
                </Badge>
              </div>
            </div>

            {/* Submission Summary Metadata */}
            <div className="space-y-3 text-xs border-y border-slate-100 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500">Issue Title:</span>
                <span className="font-semibold text-slate-900 sm:text-right">{submittedData.title}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500">Selected Department:</span>
                <span className="font-semibold text-slate-900 sm:text-right">{submittedData.department}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-900 sm:text-right">{submittedData.location}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500">Submission Timestamp:</span>
                <span className="font-semibold text-slate-900 sm:text-right flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {submittedData.date}
                </span>
              </div>
            </div>

            {/* Photo Thumbnail if attached */}
            {submittedData.photoPreview && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                  Uploaded Photo Documentation
                </span>
                <img
                  src={submittedData.photoPreview}
                  alt="Complaint Preview"
                  className="w-32 h-24 object-cover rounded-lg border border-slate-200 shadow-2xs"
                />
              </div>
            )}

            <div className="p-3.5 bg-blue-50/80 rounded-lg border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                You will receive updates in the Citizen Dashboard when a municipal officer reviews your complaint and dispatches field personnel.
              </span>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-6">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleResetForm}
              leftIcon={<FilePlus className="w-4 h-4" />}
            >
              Report Another Issue
            </Button>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <Link to={`/citizen/complaints/${submittedData.id}`} className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full sm:w-auto">
                  View Complaint
                </Button>
              </Link>
              <Link to="/citizen/dashboard" className="w-full sm:w-auto">
                <Button variant="ghost" size="md" className="w-full sm:w-auto">
                  Back to Dashboard
                </Button>
              </Link>
              <Link to="/citizen/complaints" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  View My Complaints
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // MAIN REPORT FORM
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* 1. Page Header */}
      <PageHeader
        title="Report a Civic Issue"
        description="Help improve your community by reporting civic issues in your area."
        breadcrumbs={[
          { label: 'Citizen Portal', href: '/citizen' },
          { label: 'Dashboard', href: '/citizen/dashboard' },
          { label: 'Report Issue' },
        ]}
        actions={
          <Link to="/citizen/dashboard">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Dashboard
            </Button>
          </Link>
        }
      />

      {formError && (
        <ErrorMessage
          severity="error"
          title="Submission Error"
          message={formError}
          onDismiss={() => setFormError(null)}
        />
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50/60 border-b border-slate-200">
            <CardTitle className="text-base">Issue Details & Evidence</CardTitle>
            <CardDescription>
              Complete the information below to submit a formal civic service request
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            {/* 2. Photo Upload Section */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 select-none flex items-center justify-between">
                <span>Issue Photo (Recommended)</span>
                <span className="text-xs font-normal text-slate-500">JPG, PNG, WEBP (Max 10MB)</span>
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoSelect}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                id="photo-upload-input"
              />

              {photoError && (
                <ErrorMessage
                  severity="error"
                  title="Photo Upload Error"
                  message={photoError}
                  onDismiss={() => setPhotoError(null)}
                />
              )}

              {photoPreview ? (
                /* Selected Photo Preview Area */
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={photoPreview}
                      alt="Uploaded evidence"
                      className="w-24 h-20 object-cover rounded-md border border-slate-300 shadow-2xs shrink-0"
                    />
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-slate-800 line-clamp-1">
                        {photoFile?.name || 'Uploaded photo'}
                      </p>
                      <p className="text-slate-500">
                        {photoFile ? `${(photoFile.size / 1024).toFixed(1)} KB` : 'Attached'}
                      </p>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ready for review
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                    >
                      Replace Photo
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={handleRemovePhoto}
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                /* Empty Upload Drop Area */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-slate-50/60 hover:bg-blue-50/30 transition-all cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      fileInputRef.current?.click();
                    }
                  }}
                  aria-label="Upload photo area"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click to browse photo or drag & drop here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload an on-site photo to assist field technicians in locating and assessing the issue
                  </p>
                </div>
              )}
            </div>

            {/* 3. Issue Title & 4. Department Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Issue Title */}
              <div className="space-y-1.5 text-left">
                <Input
                  id="issue-title"
                  label="Issue Title"
                  placeholder="e.g. Garbage overflowing near the public park"
                  value={title}
                  maxLength={100}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  error={errors.title}
                  helperText={`${title.length}/100 characters`}
                  required
                />
              </div>

              {/* Department Selection */}
              <div className="space-y-1.5 text-left">
                {isDeptsLoading ? (
                  <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                    <span>Loading departments...</span>
                  </div>
                ) : deptsError ? (
                  <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
                    <p className="font-semibold">{deptsError}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={refetchDepartments}
                      leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                    >
                      Retry Loading Departments
                    </Button>
                  </div>
                ) : departments.length === 0 ? (
                  <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    No departments available.
                  </div>
                ) : (
                  <Select
                    id="department-select"
                    label="Select Responsible Department"
                    placeholder="-- Choose responsible department --"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      if (errors.department) setErrors((prev) => ({ ...prev, department: '' }));
                    }}
                    options={departmentOptions}
                    error={errors.department}
                    required
                  />
                )}

                {(department === 'other' || department.includes('Other')) && (
                  <div className="p-2.5 rounded-md bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2 animate-in fade-in">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Our system will help route your complaint to the appropriate department.</span>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Issue Description */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="issue-description"
                className="text-xs font-semibold uppercase tracking-wider text-slate-700 select-none flex items-center justify-between"
              >
                <span>
                  Describe the Issue
                  <span className="text-rose-600 ml-1" aria-hidden="true">*</span>
                </span>
                <span className="text-xs font-normal text-slate-500">
                  {description.length}/1000 characters
                </span>
              </label>

              <Textarea
                id="issue-description"
                rows={4}
                maxLength={1000}
                placeholder="Explain what happened and provide useful details about the issue..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                error={errors.description}
                required
              />
            </div>

            {/* 6. Location Section */}
            <div className="space-y-4 pt-2 border-t border-slate-200 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Location of the Issue</h3>
                  <p className="text-xs text-slate-500">
                    Provide the street address or capture GPS coordinates
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetCurrentLocation}
                  isLoading={isLocating}
                  leftIcon={<Crosshair className="w-3.5 h-3.5 text-blue-700" />}
                >
                  Use My Current Location
                </Button>
              </div>

              {locationError && (
                <ErrorMessage
                  severity="warning"
                  title="Location Notice"
                  message={locationError}
                  onDismiss={() => setLocationError(null)}
                />
              )}

              {coordinates && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-900 flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>
                      GPS Coordinates Captured: <strong className="font-mono">{coordinates.lat}° N, {coordinates.lng}° E</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCoordinates(null)}
                    className="text-emerald-700 hover:text-emerald-900 underline text-xs cursor-pointer"
                  >
                    Clear GPS
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="issue-location-manual"
                  label="Street Address / Landmark"
                  placeholder="e.g. Near Community Center, 5th Main Rd"
                  value={manualLocation}
                  onChange={(e) => {
                    setManualLocation(e.target.value);
                    if (errors.manualLocation) setErrors((prev) => ({ ...prev, manualLocation: '' }));
                  }}
                  error={errors.manualLocation}
                  leftIcon={<MapPin className="w-4 h-4" />}
                  required
                />

                <Select
                  id="issue-ward-select"
                  label="Municipal Ward"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  options={[
                    { value: 'Ward 12 - Central District', label: 'Ward 12 - Central District' },
                    { value: 'Ward 14 - North Suburb', label: 'Ward 14 - North Suburb' },
                    { value: 'Ward 22 - East Industrial', label: 'Ward 22 - East Industrial' },
                    { value: 'Ward 35 - South Riverside', label: 'Ward 35 - South Riverside' },
                  ]}
                  helperText="Select the municipal jurisdiction area"
                />
              </div>
            </div>

            {/* 7. Automatic Priority Notice */}
            <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-slate-800">Automated Department Triage</span>
                <span className="text-slate-600">
                  Priority will be determined based on the issue details, public safety risks, and municipal category protocols.
                </span>
              </div>
            </div>

            {/* 8. Live Review Summary */}
            {(title.trim() || department || description.trim() || manualLocation.trim() || photoPreview) && (
              <div className="space-y-2 pt-2 border-t border-slate-200 text-left">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Submission Summary Preview</span>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start gap-3">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Summary preview"
                        className="w-14 h-14 rounded-md object-cover border border-slate-300 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-md bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-slate-900 text-sm">
                          {title.trim() || 'Untitled Complaint'}
                        </h4>
                        {department && <Badge variant="neutral" size="sm">{department}</Badge>}
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {description.trim() || 'No description entered yet.'}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {manualLocation.trim() || 'No address specified'} {coordinates && `(${coordinates.lat}, ${coordinates.lng})`} • {ward}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* 9. Submit Action Footer */}
          <CardFooter className="bg-slate-50/80 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 p-6">
            <Link to="/citizen/dashboard">
              <Button type="button" variant="ghost" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Cancel & Return
              </Button>
            </Link>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<FilePlus className="w-5 h-5" />}
              className="shadow-md"
            >
              Submit Complaint
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
