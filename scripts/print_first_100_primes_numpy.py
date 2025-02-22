#!/usr/bin/env python3

import numpy as np

def get_first_100_primes_numpy() -> np.ndarray:
    """
    Generate the first 100 prime numbers using NumPy.
    
    Returns:
        np.ndarray: Array containing the first 100 prime numbers
    """
    def is_prime_numpy(n: int) -> bool:
        if n < 2:
            return False
        # Create array of potential factors
        factors = np.arange(2, int(np.sqrt(n)) + 1)
        # Check if any factor divides n
        return not np.any(n % factors == 0)
    
    primes = []
    num = 2
    while len(primes) < 100:
        if is_prime_numpy(num):
            primes.append(num)
        num += 1
    return np.array(primes)

if __name__ == '__main__':
    print("First 100 prime numbers (using NumPy):")
    primes = get_first_100_primes_numpy()
    for prime in primes:
        print(prime)
