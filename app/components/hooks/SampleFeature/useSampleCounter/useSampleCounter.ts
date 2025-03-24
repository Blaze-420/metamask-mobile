import {useState} from 'react';

function useSampleCounter(initial = 0) {

    // TODO - implement the redux counter logic here instead of useState
    const [count, setCount] = useState(initial);
    const increment = () => setCount(prev => prev + 1);

    return {
        get value() {
            return count;
        },
        increment,
    };
}

export default useSampleCounter;
