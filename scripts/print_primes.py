#!/usr/bin/env python3

"""
This script prints the first 100 prime numbers.
Usage: python3 print_primes.py
"""

def is_prime(n):
    """
    Check if a number is prime.
    Args:
        n (int): Number to check
    Returns:
        bool: True if prime, False otherwise
    """
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def first_100_primes():
    """
    Generate the first 100 prime numbers.
    Returns:
        list: List of first 100 prime numbers
    """
    primes = []
    num = 2
    while len(primes) < 100:
        if is_prime(num):
            primes.append(num)
        num += 1
    return primes

if __name__ == "__main__":
    primes = first_100_primes()
    print("The first 100 prime numbers are:\n")
    for i, prime in enumerate(primes, 1):
        print(f"{i:3d}. {prime}")
    
    # Verify we have exactly 100 primes
    assert len(primes) == 100, f"Expected 100 primes, but got {len(primes)}"
