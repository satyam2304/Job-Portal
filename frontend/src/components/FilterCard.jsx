import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Button } from './ui/button'; // Import Button for the clear functionality
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh", "5lakh to 10lakh", "10lakh to 20 lakh", "above 20lakh"]
    },
];

const FilterCard = () => {
    // State to hold selected values for each filter category, e.g., {Location: "Bangalore", Industry: "Frontend"}
    const [selectedFilters, setSelectedFilters] = useState({});
    const dispatch = useDispatch();

    /**
     * Handler to update the state when a radio button is selected within a category.
     * @param {string} filterType - The category being updated (e.g., "Location").
     * @param {string} value - The selected value (e.g., "Bangalore").
     */
    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: value
        }));
    };

    // Effect to dispatch the combined search query whenever filters change
    useEffect(() => {
        // Combines all selected filter values into a single space-separated query string
        const query = Object.values(selectedFilters).join(' ');
        dispatch(setSearchedQuery(query));
    }, [selectedFilters, dispatch]);

    // Function to clear all selected filters
    const clearFilters = () => {
        setSelectedFilters({});
    }

    return (
        <div className='w-full bg-white p-4 rounded-md shadow-sm'>
            <div className='flex justify-between items-center'>
                <h1 className='font-bold text-lg'>Filter Jobs</h1>
                <Button variant="link" className="p-0 h-auto text-sm" onClick={clearFilters}>Clear All</Button>
            </div>
            <hr className='my-3' />
            <div className='space-y-4'>
                {
                    // Map over each filter category and create a separate RadioGroup for it
                    filterData.map((data) => (
                        <div key={data.filterType}>
                            <h2 className='font-semibold text-md mb-2'>{data.filterType}</h2>
                            <RadioGroup
                                value={selectedFilters[data.filterType] || ""}
                                onValueChange={(value) => handleFilterChange(data.filterType, value)}
                            >
                                {
                                    data.array.map((item, idx) => {
                                        const itemId = `${data.filterType}-${idx}`;
                                        return (
                                            <div key={itemId} className='flex items-center space-x-2 my-1'>
                                                <RadioGroupItem value={item} id={itemId} />
                                                <Label htmlFor={itemId} className="font-normal cursor-pointer">{item}</Label>
                                            </div>
                                        )
                                    })
                                }
                            </RadioGroup>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default FilterCard;
