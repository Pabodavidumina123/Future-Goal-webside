import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Common/Modal';
import Spinner from '../components/Common/Spinner';
import Toast from '../components/Common/Toast';
import { ShieldAlert, Mail, Phone, Globe, MapPin, Users, ClipboardList, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const AdminContactRequests = () => {
  const [contactRequests, setContactRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [organizationName, setOrganizationName] = useState('Future Path Institute');
  const [contactNumber, setContactNumber] = useState('+94 112 345 678');
  const [orgEmail, setOrgEmail] = useState('info@futurepath.lk');
  const [website, setWebsite] = useState('https://futurepath.lk');
  const [address, setAddress] = useState('No. 88, Maliban Road, Colombo');
  const [isSending, setIsSending] = useState(false);

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact-requests');
      if (res.data.success) {
        setContactRequests(res.data.contactRequests);
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Unable to load contact requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.put(`/contact-requests/${id}/status`, { status });
      if (res.data.success) {
        triggerToast(`Request status set to ${status}.`, 'success');
        setContactRequests((prev) => prev.map((request) => (request._id === id ? { ...request, status } : request)));
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Status update failed.', 'error');
    }
  };

  const openSendModalForRequest = (request) => {
    setSelectedRequest(request);
    setOpenSendModal(true);
  };

  const handleSendContactDetails = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setIsSending(true);
    try {
      const res = await api.post(`/contact-requests/${selectedRequest._id}/send-contact-details`, {
        organizationName,
        contactNumber,
        email: orgEmail,
        website,
        address,
      });

      if (res.data.success) {
        triggerToast('Contact details sent successfully.', 'success');
        setContactRequests((prev) =>
          prev.map((request) =>
            request._id === selectedRequest._id
              ? { ...request, organizationContact: res.data.contactRequest.organizationContact, status: 'approved', contactSentAt: res.data.contactRequest.contactSentAt }
              : request
          )
        );
        setOpenSendModal(false);
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Failed to send contact details.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (value) => new Date(value).toLocaleString();

  return (
    <div className="space-y-8 animate-fade-in text-left pb-16">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Contact Requests Dashboard</h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Review all contact inquiries, update request statuses, and send organization contact information directly to the user.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-xs text-slate-300">
          <ShieldAlert className="h-4 w-4 text-indigo-400" /> Admin only access
        </div>
      </div>

      {loading ? (
        <div className="py-24">
          <Spinner size="large" />
        </div>
      ) : contactRequests.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-slate-800 p-12 text-center text-slate-400">
          <ClipboardList className="mx-auto h-10 w-10 text-slate-500 mb-4" />
          <h2 className="text-lg font-bold text-white">No Contact Requests</h2>
          <p className="text-xs text-slate-500 mt-2">Students will see this page populated once they submit a contact request from the course page.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {contactRequests.map((request) => (
            <div key={request._id} className="glass-panel rounded-3xl border border-slate-800 p-6 shadow-xl">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                    <span>{request.course?.category || 'General'}</span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-400">Requested {formatDate(request.createdAt)}</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-100">{request.courseName}</h2>
                    <p className="text-xs text-slate-400 max-w-2xl">{request.message || 'No message supplied by the requester.'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-300">
                    <div className="space-y-1">
                      <span className="block text-[11px] text-slate-500 uppercase tracking-widest">Student</span>
                      <p className="font-semibold text-slate-100">{request.requesterName}</p>
                      <p className="text-xs text-slate-500">{request.requesterEmail}</p>
                      <p className="text-xs text-slate-500">{request.requesterPhone}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[11px] text-slate-500 uppercase tracking-widest">Status</span>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${request.status === 'pending' ? 'bg-amber-950/70 text-amber-300' : request.status === 'approved' ? 'bg-emerald-950/70 text-emerald-300' : 'bg-rose-950/70 text-rose-300'}`}>
                        {request.status}
                      </span>
                      <p className="text-[11px] text-slate-500">Reviewed at: {request.reviewedAt ? formatDate(request.reviewedAt) : 'Not yet reviewed'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[11px] text-slate-500 uppercase tracking-widest">Contact Info Sent</span>
                      <p className="text-sm text-slate-300">{request.contactSentAt ? formatDate(request.contactSentAt) : 'Not sent yet'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 items-start md:items-end">
                  <button
                    onClick={() => handleUpdateStatus(request._id, 'approved')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-emerald-400 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(request._id, 'rejected')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-rose-400 transition-colors"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                  <button
                    onClick={() => openSendModalForRequest(request)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-indigo-500 transition-colors"
                  >
                    <Mail className="h-4 w-4" /> Send Contact Details
                  </button>
                </div>
              </div>

              {request.organizationContact && (
                <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-slate-500 mb-3">Organization Contact Delivered</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <p className="text-xs"><span className="font-semibold text-slate-200">Name:</span> {request.organizationContact.name}</p>
                    <p className="text-xs"><span className="font-semibold text-slate-200">Phone:</span> {request.organizationContact.phone}</p>
                    <p className="text-xs"><span className="font-semibold text-slate-200">Email:</span> {request.organizationContact.email}</p>
                    <p className="text-xs"><span className="font-semibold text-slate-200">Website:</span> {request.organizationContact.website || 'N/A'}</p>
                    <p className="text-xs col-span-full"><span className="font-semibold text-slate-200">Address:</span> {request.organizationContact.address || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={openSendModal}
        onClose={() => setOpenSendModal(false)}
        title={`Send Contact Details to ${selectedRequest?.requesterName}`}
      >
        <form onSubmit={handleSendContactDetails} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2 text-xs text-slate-400">
              Organization Name
              <input
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200"
                required
              />
            </label>
            <label className="space-y-2 text-xs text-slate-400">
              Contact Number
              <input
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200"
                required
              />
            </label>
            <label className="space-y-2 text-xs text-slate-400">
              Email Address
              <input
                type="email"
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200"
                required
              />
            </label>
            <label className="space-y-2 text-xs text-slate-400">
              Website
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200"
              />
            </label>
          </div>

          <label className="space-y-2 text-xs text-slate-400">
            Address
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 resize-none"
              rows={3}
            />
          </label>

          <div className="flex flex-wrap gap-3 justify-end">
            <button
              type="button"
              onClick={() => setOpenSendModal(false)}
              className="rounded-2xl border border-slate-800 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-indigo-500 transition-colors"
              disabled={isSending}
            >
              <Mail className="h-4 w-4" />
              {isSending ? 'Sending...' : 'Send Contact Details'}
            </button>
          </div>
        </form>
      </Modal>

      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />}
    </div>
  );
};

export default AdminContactRequests;
