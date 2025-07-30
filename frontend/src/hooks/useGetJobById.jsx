import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { JOB_API_END_POINT } from '../utils/constant'; // Ensure you have this constant defined
import { setSingleJob } from '../redux/jobSlice'; // Ensure you have this action in your jobSlice

/**
 * Custom hook to fetch a single job by its ID from the API.
 * It dispatches an action to store the fetched job data in the Redux store.
 * @param {string} id - The ID of the job to fetch.
 */
const useGetJobById = (id) => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Define the async function to fetch data
        const fetchJobById = async () => {
            // If there's no ID, don't attempt to fetch
            if (!id) return;

            try {
                // Set the authorization header for the request
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`);

                // On success, dispatch the action to update the Redux store
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                }
            } catch (error) {
                console.error("Error fetching job by ID:", error);
                // Optionally, you could dispatch an error action here
            }
        };

        fetchJobById();

    }, [id, dispatch]); // Effect dependencies: re-run if id or dispatch changes
};

export default useGetJobById;
