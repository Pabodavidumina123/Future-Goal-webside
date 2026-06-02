export const validateCourseInput = (req, res, next) => {
  const {
    title,
    category,
    description,
    duration,
    fee,
    level,
    image,
    organization,
    website,
    contactNumber,
    email,
    startDate,
    endDate,
    schedule,
    location,
    availableSeats,
    requirements,
    learningOutcomes,
    status,
    instructor,
    instructorName,
    instructorEmail,
    instructorPhone,
    instructorBio,
    instructorImage,
  } = req.body;

  const errors = [];

  if (!title || !title.trim()) errors.push('Course title is required');
  if (!category || !category.trim()) errors.push('Course category is required');
  if (!description || !description.trim()) errors.push('Course description is required');
  if (!duration || !duration.trim()) errors.push('Course duration is required');
  if (!fee || Number.isNaN(Number(fee))) errors.push('Course fee is required and must be a number');
  if (!level || !['Beginner', 'Intermediate', 'Advanced'].includes(level)) errors.push('Course level is required');
  if (!organization || !organization.trim()) errors.push('Organization name is required');
  if (!contactNumber || !contactNumber.trim()) errors.push('Contact number is required');
  if (!email || !email.trim()) errors.push('Email address is required');
  if (!website || !website.trim()) errors.push('Website URL is required');
  if (!startDate || isNaN(Date.parse(startDate))) errors.push('Valid course start date is required');
  if (!endDate || isNaN(Date.parse(endDate))) errors.push('Valid course end date is required');
  if (new Date(startDate) > new Date(endDate)) errors.push('Course end date must be after start date');
  if (!schedule || !schedule.trim()) errors.push('Course schedule is required');
  if (!location || !location.trim()) errors.push('Course location is required');
  if (!availableSeats || Number.isNaN(Number(availableSeats))) errors.push('Available seats is required and must be a number');
  if (!Array.isArray(learningOutcomes) || learningOutcomes.length === 0) errors.push('At least one learning outcome is required');
  if (!Array.isArray(requirements) || requirements.length === 0) errors.push('At least one requirement is required');
  if (!status || !['Active', 'Inactive'].includes(status)) errors.push('Course status is required');

  const instructorPayload = instructor || {
    name: instructorName,
    email: instructorEmail,
    phone: instructorPhone,
    role: req.body.instructorRole,
    bio: instructorBio,
    image: instructorImage,
  };

  if (!instructorPayload?.name || !instructorPayload.name.trim()) errors.push('Instructor name is required');
  if (!instructorPayload?.email || !instructorPayload.email.trim()) errors.push('Instructor email is required');
  if (!instructorPayload?.phone || !instructorPayload.phone.trim()) errors.push('Instructor phone is required');
  if (!instructorPayload?.role || !instructorPayload.role.trim()) errors.push('Instructor role is required');
  if (!instructorPayload?.bio || !instructorPayload.bio.trim()) errors.push('Instructor bio is required');
  if (!instructorPayload?.image || !instructorPayload.image.trim()) errors.push('Instructor image is required');

  if (!image || !image.trim()) errors.push('Course image is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join('. ') });
  }

  req.body.fee = Number(fee);
  req.body.availableSeats = Number(availableSeats);
  req.body.startDate = new Date(startDate);
  req.body.endDate = new Date(endDate);
  req.body.learningOutcomes = Array.isArray(learningOutcomes)
    ? learningOutcomes.map((item) => item.trim()).filter(Boolean)
    : String(learningOutcomes || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
  req.body.requirements = Array.isArray(requirements)
    ? requirements.map((item) => item.trim()).filter(Boolean)
    : String(requirements || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
  req.body.instructor = {
    name: instructorPayload.name.trim(),
    email: instructorPayload.email.trim(),
    phone: instructorPayload.phone.trim(),
    role: instructorPayload.role.trim(),
    bio: instructorPayload.bio.trim(),
    image: instructorPayload.image.trim(),
  };

  next();
};
