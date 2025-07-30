import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import useGetJobById from '@/hooks/useGetJobById';
import { setSingleJob } from '@/redux/jobSlice';

const JobSetup = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useGetJobById(params.id);
    const { singleJob } = useSelector(store => store.job);

    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experienceLevel: "", // This will now be a number
        position: 0,
    });
    const [loading, setLoading] = useState(false);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleJobTypeChange = (value) => {
        setInput({ ...input, jobType: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const requirementsArray = input.requirements.split(',').map(req => req.trim()).filter(req => req);
            const payload = { ...input, requirements: requirementsArray };

            const res = await axios.put(`${JOB_API_END_POINT}/update/${params.id}`, payload, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (singleJob) {
            setInput({
                title: singleJob.title || "",
                description: singleJob.description || "",
                requirements: singleJob.requirements?.join(', ') || "",
                salary: singleJob.salary || "",
                location: singleJob.location || "",
                jobType: singleJob.jobType || "",
                experienceLevel: singleJob.experienceLevel || "", // Changed from 'experience'
                position: singleJob.position || 0,
            });
        }
    }, [singleJob]);

    useEffect(() => {
        return () => {
            dispatch(setSingleJob(null));
        }
    }, [dispatch]);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto my-10 p-8'>
                <div className='flex items-center justify-between mb-8'>
                    <Button onClick={() => navigate("/admin/jobs")} variant="outline" className="flex items-center gap-2">
                        <ArrowLeft />
                        <span>Back</span>
                    </Button>
                    <h1 className='font-bold text-2xl'>Update Job</h1>
                </div>
                <form onSubmit={submitHandler} className='space-y-6'>
                    {/* ... other form fields ... */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <Label>Title</Label>
                            <Input type="text" name="title" value={input.title} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input type="text" name="location" value={input.location} onChange={changeEventHandler} />
                        </div>
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea name="description" value={input.description} onChange={changeEventHandler} />
                    </div>
                    <div>
                        <Label>Requirements (Comma-separated)</Label>
                        <Textarea name="requirements" value={input.requirements} onChange={changeEventHandler} />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <Label>Salary Range</Label>
                            <Input type="text" name="salary" value={input.salary} onChange={changeEventHandler} placeholder="e.g., 50000" />
                        </div>
                        <div>
                            <Label>No. of Positions</Label>
                            <Input type="number" name="position" value={input.position} onChange={changeEventHandler} />
                        </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <Label>Job Type</Label>
                            <Select value={input.jobType} onValueChange={handleJobTypeChange}>
                                <SelectTrigger><SelectValue placeholder="Select job type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            {/* FIX: Changed from a Select to a number Input to match the model */}
                            <Label>Experience Level (in years)</Label>
                            <Input type="number" name="experienceLevel" value={input.experienceLevel} onChange={changeEventHandler} placeholder="e.g., 2" />
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        {loading ? (
                            <Button className="w-full md:w-auto" disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full md:w-auto">Update Job</Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobSetup;
