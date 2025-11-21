import React from "react";
import { Form, Input, Select, SelectItem, Button } from "@heroui/react";
import DefaultLayout from "@/layouts/default";

export default function CreateHotelForm() {
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const [serverMsg, setServerMsg] = React.useState(null);
  const fileRef = React.useRef(null);

  // keep selected files and their preview URLs for UI
  const [imagePreviews, setImagePreviews] = React.useState([]);

  // helper to update previews when user picks files
  const handleFilesChange = (files) => {
    if (!files) return;
    // revoke old URLs
    imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    const arr = Array.from(files).map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setImagePreviews(arr);
  };

  React.useEffect(() => {
    // cleanup on unmount
    return () => {
      imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [imagePreviews]);

  // basic validation for required fields similar to backend expectation
  const validate = (data, files) => {
    const e = {};
    if (!data.get("name")?.trim()) e.name = "Name is required";
    if (!data.get("phone")?.trim()) e.phone = "Phone is required";
    if (!data.get("price")?.trim()) e.price = "Price is required";
    if (!data.get("room")?.trim()) e.room = "Room info is required";
    if (!data.get("pgType")?.trim()) e.pgType = "PG Type is required";

    if (!data.get("address1")?.trim()) e.address1 = "Address is required";
    if (!data.get("district")?.trim()) e.district = "District is required";
    if (!data.get("state")?.trim()) e.state = "State is required";

    if (!data.get("bed")?.trim()) e.bed = "Bed info is required";
    if (!data.get("wifi")?.trim()) e.wifi = "Wifi (yes/no) is required";
    if (!data.get("furnished")?.trim()) e.furnished = "Furnished info required";

    // latitude & longitude should exist and be parseable
    const lat = data.get("latitude");
    const lng = data.get("longitude");
    if (!lat || isNaN(parseFloat(lat))) e.latitude = "Valid latitude required";
    if (!lng || isNaN(parseFloat(lng))) e.longitude = "Valid longitude required";

    // optional: ensure at least one image if you want
    // if (files && files.length === 0) e.images = "Please add at least one image";

    return e;
  };

  const useMyLocation = (setFieldValue) => {
    setServerMsg(null);
    if (!navigator.geolocation) {
      setServerMsg("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // set values into the inputs: since we're not using form libraries, we set DOM inputs
        // We provide a small helper: setFieldValue is a function that writes to DOM inputs
        setFieldValue("latitude", String(latitude));
        setFieldValue("longitude", String(longitude));
        setServerMsg("Location filled from your device.");
        // clear any previous latitude/longitude validation errors
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.latitude;
          delete copy.longitude;
          return copy;
        });
      },
      (err) => {
        // handle geolocation errors clearly
        if (err.code === err.PERMISSION_DENIED) {
          setServerMsg("Location permission denied. Allow location access to use this feature.");
        } else {
          setServerMsg("Unable to get location: " + err.message);
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerMsg(null);
    setErrors({});

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    // Append files explicitly under images[]
    const files = fileRef.current?.files;
    if (files && files.length > 0) {
      fd.delete("images[]");
      for (let i = 0; i < files.length; i++) {
        fd.append("images[]", files[i]);
      }
    }

    const validationErrors = validate(fd, files);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/hotels", {
        method: "POST",
        body: fd,
      });

      const json = await res.json().catch(() => ({ message: "No JSON response" }));

      if (!res.ok) {
        setServerMsg(json.error || json.message || `Server returned ${res.status}`);
      } else {
        setServerMsg("Hotel created successfully");
        formEl.reset();
        if (fileRef.current) fileRef.current.value = "";
        // clear previews
        imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
        setImagePreviews([]);
        setErrors({});
      }
    } catch (err) {
      setServerMsg("Network error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    setErrors({});
    setServerMsg(null);
    if (fileRef.current) fileRef.current.value = "";
    imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    setImagePreviews([]);
  };

  // helper to set DOM form input values (used by useMyLocation)
  // React state for latitude and longitude so the UI updates instantly
  const [latLng, setLatLng] = React.useState({ latitude: "", longitude: "" });

  const setFieldValue = (name, value) => {
    setLatLng((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <DefaultLayout> 
    <Form
      className="w-full justify-center items-center space-y-4"
      validationErrors={errors}
      onReset={onReset}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-4 max-w-lg">
        <Input
          isRequired
          label="Name"
          labelPlacement="outside"
          name="name"
          placeholder="Green Residency"
          errorMessage={() => errors.name}
        />

        <Input
          isRequired
          label="Phone"
          labelPlacement="outside"
          name="phone"
          placeholder="9876543210"
          type="tel"
          errorMessage={() => errors.phone}
        />

        <Input
          isRequired
          label="Price"
          labelPlacement="outside"
          name="price"
          placeholder="5500"
          type="number"
          errorMessage={() => errors.price}
        />

        <Input
          isRequired
          label="Room"
          labelPlacement="outside"
          name="room"
          placeholder="2 BHK"
          errorMessage={() => errors.room}
        />

        <Select
          isRequired
          label="PG Type"
          labelPlacement="outside"
          name="pgType"
          placeholder="Select PG Type"
        >
          <SelectItem key="boys">Boys</SelectItem>
          <SelectItem key="girls">Girls</SelectItem>
          <SelectItem key="co">Co-living</SelectItem>
        </Select>

        <Input
          isRequired
          label="Address Line 1"
          labelPlacement="outside"
          name="address1"
          placeholder="Near City Mall"
          errorMessage={() => errors.address1}
        />

        <Input
          isRequired
          label="District"
          labelPlacement="outside"
          name="district"
          placeholder="Lucknow"
          errorMessage={() => errors.district}
        />

        <Input
          isRequired
          label="State"
          labelPlacement="outside"
          name="state"
          placeholder="Uttar Pradesh"
          errorMessage={() => errors.state}
        />

        <Input
          isRequired
          label="Bed"
          labelPlacement="outside"
          name="bed"
          placeholder="Single / Double"
          errorMessage={() => errors.bed}
        />

        <Select
          isRequired
          label="Wifi"
          labelPlacement="outside"
          name="wifi"
          placeholder="yes / no"
        >
          <SelectItem key="yes">yes</SelectItem>
          <SelectItem key="no">no</SelectItem>
        </Select>

        <Select
          isRequired
          label="Furnished"
          labelPlacement="outside"
          name="furnished"
          placeholder="furnished / semi / unfurnished"
        >
          <SelectItem key="furnished">furnished</SelectItem>
          <SelectItem key="semi">semi</SelectItem>
          <SelectItem key="unfurnished">unfurnished</SelectItem>
        </Select>

        <div className="flex gap-2 items-end">
          <Input
            isRequired
            label="Latitude"
            labelPlacement="outside"
            name="latitude"
            value={latLng.latitude}
            onChange={(e) => setLatLng({ ...latLng, latitude: e.target.value })}
            placeholder="26.8467"
            errorMessage={() => errors.latitude}
          />
          <Input
            isRequired
            label="Longitude"
            labelPlacement="outside"
            name="longitude"
            value={latLng.longitude}
            onChange={(e) => setLatLng({ ...latLng, longitude: e.target.value })}
            placeholder="80.9462"
            errorMessage={() => errors.longitude}
          />
          <div className="mt-6">
            <Button
              type="button"
              onClick={() => useMyLocation(setFieldValue)}
              disabled={submitting}
            >
              Use my location
            </Button>
          </div>
        </div>

        {/* Native file input for images (multiple). Name `images[]` as you asked. */}
        <div>
          <label className="block mb-1 text-small">Images</label>
          <input
            ref={fileRef}
            name="images[]"
            type="file"
            multiple
            accept="image/*"
            onChange={(ev) => handleFilesChange(ev.target.files)}
          />
          {errors.images && <div className="text-danger text-small">{errors.images}</div>}

          {/* Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {imagePreviews.map((p, i) => (
                <div key={i} className="border rounded overflow-hidden p-1">
                  <img src={p.url} alt={`preview-${i}`} className="w-full h-24 object-cover" />
                  <div className="text-xs truncate mt-1">{p.file.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button className="w-full" color="primary" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Create Hotel"}
          </Button>
          <Button type="reset" variant="bordered" disabled={submitting}>
            Reset
          </Button>
        </div>

        {serverMsg && <div className="text-small mt-2">{serverMsg}</div>}
      </div>
      <div> <br></br></div>
    </Form>
     </DefaultLayout>
  );
}
