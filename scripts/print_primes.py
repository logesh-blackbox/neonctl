#!/usr/bin/env python3

# This script prints the first 50 prime numbers.
# Usage: python3 print_primes.py

def is_prime(n):
    '''Check if a number is prime'''
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def first_50_primes():
    '''Generate the first 50 prime numbers'''
    primes = []
    num = 2
    while len(primes) < 50:
        if is_prime(num):
            primes.append(num)
        num += 1
    return primes

if __name__ == "__main__":
    print("The first 50 prime numbers are:")
    primes = first_50_primes()
    # Print one prime per line for better readability
    for i, prime in enumerate(primes, 1):
        print(f"{i}. {prime}")
