#!/usr/bin/env python3

from typing import List

def is_prime(n: int) -> bool:
    """
    Check if a number is prime.
    
    Args:
        n (int): Number to check for primality
        
    Returns:
        bool: True if the number is prime, False otherwise
    """
    # Numbers less than 2 are not prime
    if n < 2:
        return False
    
    # 2 is prime
    if n == 2:
        return True
    
    # Even numbers greater than 2 are not prime
    if n > 2 and n % 2 == 0:
        return False
    
    # Check odd numbers up to square root of n
    for i in range(3, int(n ** 0.5) + 1, 2):
        if n % i == 0:
            return False
    
    return True

def generate_n_primes(n: int) -> List[int]:
    """
    Generate first n prime numbers.
    
    Args:
        n (int): Number of prime numbers to generate
        
    Returns:
        List[int]: List containing first n prime numbers
    
    Raises:
        ValueError: If n is less than 1
    """
    if n < 1:
        raise ValueError("Number of primes to generate must be positive")
    
    primes = []
    num = 2
    
    while len(primes) < n:
        if is_prime(num):
            primes.append(num)
        num += 1
    
    return primes

def main():
    """
    Main function to print first 100 prime numbers.
    """
    try:
        # Generate first 100 prime numbers
        primes = generate_n_primes(100)
        
        # Print the numbers in a formatted way
        print("First 100 prime numbers:")
        for i, prime in enumerate(primes, 1):
            print(f"{i:3d}: {prime:4d}", end='\t')
            if i % 5 == 0:  # New line after every 5 numbers
                print()
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
