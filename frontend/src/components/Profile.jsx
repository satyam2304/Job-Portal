import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import AdminJobsTable from './admin/AdminJobsTable';

const Profile = () => {
    const { user } = useSelector(store => store.auth);
    const [open, setOpen] = useState(false);
    
    // Determine user role for conditional rendering
    const isRecruiter = user?.role === 'recruiter';

    // Conditionally call the hook only for students/applicants
    if (!isRecruiter) {
        useGetAppliedJobs();
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            {/* Use dynamic profile photo with a fallback */}
                            <AvatarImage 
                                src={user?.profile?.profilePhoto || "https://placehold.co/100x100/E2E8F0/4A5568?text=Profile"} 
                                alt="profile" 
                            />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-2xl'>{user?.fullname}</h1>
                            {/* Conditionally render bio for non-recruiters */}
                            {!isRecruiter && <p className='text-gray-600 mt-1'>{user?.profile?.bio || "No bio available."}</p>}
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                </div>

                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>

                {/* --- STUDENT/APPLICANT SPECIFIC SECTION --- */}
                {!isRecruiter && (
                    <>
                        <div className='my-5'>
                            <h1 className='font-semibold text-lg'>Skills</h1>
                            <div className='flex items-center gap-2 mt-2'>
                                {user?.profile?.skills && user.profile.skills.length > 0 
                                    ? user.profile.skills.map((item, index) => <Badge key={index}>{item}</Badge>) 
                                    : <span>No skills added.</span>
                                }
                            </div>
                        </div>
                        <div className='grid w-full max-w-sm items-center gap-1.5 my-5'>
                            <Label className="text-md font-semibold">Resume</Label>
                            {user?.profile?.resume 
                                ? <a target='_blank' rel="noopener noreferrer" href={user.profile.resume} className='text-blue-600 hover:underline cursor-pointer'>{user.profile.resumeOriginalName || "View Resume"}</a> 
                                : <span>No resume uploaded.</span>
                            }
                        </div>
                    </>
                )}
            </div>

            {/* --- APPLIED JOBS TABLE (for students) or POSTED JOBS (for recruiters) --- */}
            <div className='max-w-4xl mx-auto bg-white rounded-2xl p-8 my-5'>
                <h1 className='font-bold text-xl mb-5'>
                    {isRecruiter ? "Jobs Posted" : "Applied Jobs"}
                </h1>
                
                {isRecruiter ? (
                    // Placeholder for a future component that shows jobs posted by the recruiter
                    <div className='text-center text-gray-500'>
                        <p>Your posted jobs will appear here.</p>
                        <AdminJobsTable/>
                    </div>
                ) : (
                    <AppliedJobTable />
                )}
            </div>

            {/* The unified dialog component works for both roles */}
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
}

export default Profile;
