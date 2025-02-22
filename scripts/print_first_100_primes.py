#!/usr/bin/env python3

def is_prime(n: int) -> bool:
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

def get_first_100_primes() -> list:
    """
    Generate the first 100 prime numbers.
    
    Returns:
        list: List containing the first 100 prime numbers
    """
    primes = []
    num = 2
    while len(primes) < 100:
        if is_prime(num):
            primes.append(num)
        num += 1
    return primes

if __name__ == '__main__':
    print("First 100 prime numbers:")
    for prime in get_first_100_primes():
        print(prime)
