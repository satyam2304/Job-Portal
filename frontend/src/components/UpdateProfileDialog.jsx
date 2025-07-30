import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const UpdateProfileDialog = ({ open, setOpen }) => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const isRecruiter = user?.role === 'recruiter';

    // State for all possible form inputs
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        bio: '',
        skills: '',
    });

    // Separate state for file inputs
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);

    // Effect to initialize form data when the user object is available
    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                bio: user.profile?.bio || "",
                skills: user.profile?.skills?.join(', ') || "",
            });
        }
    }, [user, open]); // Re-initialize when dialog opens

    // Handler for all text input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handler for file changes
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            if (name === 'profilePhoto') {
                setProfilePhoto(files[0]);
            } else if (name === 'resume') {
                setResume(files[0]);
            }
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();

        // Append common fields
        data.append("email", formData.email);
        data.append("phoneNumber", formData.phoneNumber);
        if (profilePhoto) {
            data.append("profilePhoto", profilePhoto);
        }

        // Append fields for students/applicants only
        if (!isRecruiter) {
            data.append("fullname", formData.fullname);
            data.append("bio", formData.bio);
            data.append("skills", formData.skills);
            if (resume) {
                data.append("resume", resume);
            }
        }

        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] bg-background text-foreground rounded-lg shadow-lg z-[999]" onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                    <div className='grid gap-4 py-4'>
                        {/* --- Fields for Students/Applicants Only --- */}
                        {!isRecruiter && (
                            <>
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label htmlFor="fullname" className="text-right">Name</Label>
                                    <Input id="fullname" name="fullname" type="text" value={formData.fullname} onChange={handleChange} className="col-span-3" />
                                </div>
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label htmlFor="bio" className="text-right">Bio</Label>
                                    <Input id="bio" name="bio" value={formData.bio} onChange={handleChange} className="col-span-3" />
                                </div>
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label htmlFor="skills" className="text-right">Skills</Label>
                                    <Input id="skills" name="skills" value={formData.skills} onChange={handleChange} className="col-span-3" placeholder="HTML, CSS, React" />
                                </div>
                            </>
                        )}

                        {/* --- Common Fields for All Users --- */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="phoneNumber" className="text-right">Number</Label>
                            <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="profilePhoto" className="text-right">Photo</Label>
                            <Input id="profilePhoto" name="profilePhoto" type="file" accept="image/*" onChange={handleFileChange} className="col-span-3" />
                        </div>

                        {/* --- Resume Field for Students/Applicants Only --- */}
                        {!isRecruiter && (
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="resume" className="text-right">Resume</Label>
                                <Input id="resume" name="resume" type="file" accept="application/pdf" onChange={handleFileChange} className="col-span-3" />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        {loading ? (
                            <Button className="w-full my-4" disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4">Update</Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;