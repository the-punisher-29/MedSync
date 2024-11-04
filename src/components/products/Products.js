// import React from 'react';
// import Bounce from 'react-reveal/Bounce';
// import useFetch from '../../hooks/useFetch';
// import Heading from '../Heading';
// import Product from './Product';

// const Products = () => {
//     const [data] = useFetch('products');
    
//     return (
//         <section className="max-w-screen-xl mx-auto px-6 py-6 pb-24">
//             {/* heading  */}
//             <Heading title="Products" />
//             {/* products  */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-6">
//                 {data.slice(0,6).map(product => (
//                     <Bounce left key={product.id}>
//                         <Product {...product} />
//                     </Bounce>
//                 ))}
//             </div>
                
//         </section>
//     )
// }

// export default Products

import React from 'react';
import Bounce from 'react-reveal/Bounce';
import useFetch from '../../hooks/useFetch';
import Heading from '../Heading';
import Product from './Product';

const Products = () => {
    const [data, loading, error] = useFetch('products'); // Adjusted useFetch to return loading and error states
    
    return (
        <section className="max-w-screen-xl mx-auto px-6 py-6 pb-24">
            {/* heading */}
            <Heading title="Products" />
            
            {/* Loading and Error states */}
            {loading && <p>Loading products...</p>}
            {error && <p>Error loading products: {error.message}</p>}

            {/* products */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-6">
                    {data.slice(0, 6).map(product => (
                        <Bounce left key={product.id}>
                            <Product {...product} />
                        </Bounce>
                    ))}
                </div>
            )}
        </section>
    );
}

export default Products;
// In the updated Products component, we added loading and error states to handle the loading and error scenarios when fetching data from Firestore. We display a loading message when the data is being fetched and an error message if there is an error. The products are only rendered if the loading and error states are false, indicating that the data has been successfully fetched. This helps provide a better user experience by informing the user about the status of the data fetching process   