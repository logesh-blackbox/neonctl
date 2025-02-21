#!/usr/bin/env python3

def is_prime(n):
    """
    Check if a number is prime.
    
    Args:
        n (int): Number to check
    
    Returns:
        bool: True if the number is prime, False otherwise
    """
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

def get_first_n_primes(n):
    """
    Generate the first n prime numbers.
    
    Args:
        n (int): Number of prime numbers to generate
    
    Returns:
        list: List containing first n prime numbers
    """
    primes = []
    num = 2
    while len(primes) < n:
        if is_prime(num):
            primes.append(num)
        num += 1
    return primes

def main():
    """
    Main function to print the first 100 prime numbers.
    """
    n = 100
    primes = get_first_n_primes(n)
    print(f"First {n} prime numbers:")
    for i, prime in enumerate(primes, 1):
        print(f"{i:3d}: {prime:4d}")

if __name__ == "__main__":
    main()
