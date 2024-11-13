// import React, { useState, useEffect } from 'react';
// import Bounce from 'react-reveal/Bounce';
// import Heading from '../components/Heading';
// import Product from '../components/products/Product';
// import useFetch from '../hooks/useFetch';

// const ProductsScreen = () => {
//     const [data, setData] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isLoading, setIsLoading] = useState(true);

//     // Fetch products using the useFetch custom hook
//     const [fetchedData] = useFetch('products');

//     useEffect(() => {
//         // Ensure fetchedData is available before setting data
//         if (fetchedData) {
//             setData(fetchedData);
//             setIsLoading(false);
//         }
//     }, [fetchedData]);

//     // Filter products based on the search query using the title field
//     const filteredData = data.filter(product =>
//         product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     // Log filtered data for debugging
//     useEffect(() => {
//         console.log('Filtered Data:', filteredData);
//     }, [filteredData]);

//     // Handle search input change
//     const handleSearchChange = (e) => {
//         setSearchQuery(e.target.value);
//     };

//     // Display loading spinner or products based on data
//     if (isLoading) {
//         return <div>Loading...</div>; // Or display a loading spinner
//     }

//     return (
//         <section className="max-w-screen-xl py-24 mx-auto px-6">
//             {/* Heading */}
//             <Heading title="Products" />
            
//             {/* Search Bar */}
//             <div className="mb-6 flex justify-center">
//                 <input
//                     type="text"
//                     placeholder="Search Products..."
//                     value={searchQuery}
//                     onChange={handleSearchChange}
//                     className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                 />
//             </div>

//             {/* Products */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-6">
//                 {(searchQuery ? filteredData : data).map(product => (
//                     <Bounce left key={product.id}>
//                         <Product {...product} />
//                     </Bounce>
//                 ))}
//             </div>
//         </section>
//     );
// };

// export default ProductsScreen;


import React, { useState, useEffect } from 'react';
import Bounce from 'react-reveal/Bounce';
import Heading from '../components/Heading';
import Product from '../components/products/Product';
import useFetch from '../hooks/useFetch';
import Navbar from '../components/Navbar/Navbar'

const ProductsScreen = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch products from the Firestore collection 'products'
    const [fetchedData] = useFetch('products'); // Assuming this fetches the data from Firestore

    useEffect(() => {
        // Ensure fetchedData is available before setting data
        if (fetchedData) {
            setData(fetchedData);
            console.log("Data of Products :- ",fetchedData);
            setIsLoading(false);
        }
    }, [fetchedData]);

    // Filter products based on the search query using the title field
    const filteredData = data.filter(product =>
        product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group products by type (assuming each product has a 'type' field)
    const groupedData = filteredData.reduce((acc, product) => {
        const { type } = product; // Assuming 'type' is the field to categorize
        if (type) {
            if (!acc[type]) acc[type] = [];
            acc[type].push(product);
        }
        return acc;
    }, {});

    // Log grouped data for debugging
    useEffect(() => {
        console.log('Grouped Data:', groupedData);
    }, [groupedData]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Display loading spinner or products based on data
    if (isLoading) {
        return <div>Loading...</div>; // Or display a loading spinner
    }

    return (
        <>
        <Navbar />
        <section className="max-w-screen-xl py-24 mx-auto px-6">
            {/* Heading */}
            <Heading title="Products" />

            {/* Search Bar */}
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Search Products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Render sections based on product type */}
            {Object.keys(groupedData).map((type) => (
                <div key={type} className="py-6">
                    {/* Type Heading */}
                    <h2 className="text-3xl font-bold text-gray-700">{type}</h2>
                    <div className="mt-4 text-lg text-gray-500">
                        {/* Display products in the current type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-6">
                            {groupedData[type].map((product) => (
                                <Bounce left key={product.id}>
                                    <Product {...product} />
                                </Bounce>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </section>
        </>
    );
};

export default ProductsScreen;
