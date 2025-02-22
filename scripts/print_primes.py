"""
This script generates and prints prime numbers using the Sieve of Eratosthenes algorithm.
Usage: python3 print_primes.py [number_of_primes]
"""

import sys
import math
from typing import List

def sieve_of_eratosthenes(n: int) -> List[int]:
    """
    Generate prime numbers up to n using the Sieve of Eratosthenes algorithm.
    
    Args:
        n (int): The upper limit for generating prime numbers.
    
    Returns:
        List[int]: A list of prime numbers up to n.
    """
    if n < 2:
        return []
    
    sieve = [True] * (n + 1)
    sieve[0] = sieve[1] = False
    
    for i in range(2, int(n**0.5) + 1):
        if sieve[i]:
            for j in range(i*i, n + 1, i):
                sieve[j] = False
    
    return [i for i in range(2, n + 1) if sieve[i]]

def estimate_nth_prime(n: int) -> int:
    """
    Estimate the value of the nth prime number.
    
    Args:
        n (int): The position of the prime number to estimate.
    
    Returns:
        int: An estimate of the nth prime number.
    """
    if n < 6:
        return 13  # The 6th prime is 13
    return int(n * (math.log(n) + math.log(math.log(n))))

def generate_n_primes(n: int) -> List[int]:
    """
    Generate the first n prime numbers.
    
    Args:
        n (int): The number of prime numbers to generate.
    
    Returns:
        List[int]: A list of the first n prime numbers.
    """
    if n < 1:
        return []
    
    upper_bound = estimate_nth_prime(n)
    while True:
        primes = sieve_of_eratosthenes(upper_bound)
        if len(primes) >= n:
            return primes[:n]
        upper_bound = int(upper_bound * 1.2)  # Increase by 20%

def main():
    try:
        if len(sys.argv) > 1:
            n = int(sys.argv[1])
            if n < 1:
                raise ValueError("Number of primes must be a positive integer.")
            if n > 1_000_000:
                raise ValueError("Number of primes is too large. Maximum allowed is 1,000,000.")
        else:
            n = 50  # Default to 50 primes if no argument is provided
        
        primes = generate_n_primes(n)
        print(f"The first {n} prime numbers are:")
        for i, prime in enumerate(primes, 1):
            print(f"{i:7d}: {prime:10d}")
    
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except MemoryError:
        print("Error: Not enough memory to complete the operation.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
