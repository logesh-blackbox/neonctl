
#!/usr/bin/env python3

from typing import List

PRIME_COUNT = 100

def sieve_of_eratosthenes(n: int) -> List[int]:
    """
    Generate prime numbers up to n using the Sieve of Eratosthenes algorithm.
    
    Args:
        n (int): Upper limit for prime generation
        
    Returns:
        List[int]: List of prime numbers up to n
    """
    sieve = [True] * (n + 1)
    sieve[0] = sieve[1] = False
    
    for i in range(2, int(n**0.5) + 1):
        if sieve[i]:
            for j in range(i*i, n + 1, i):
                sieve[j] = False
    
    return [i for i in range(2, n + 1) if sieve[i]]

def get_n_primes(n: int) -> List[int]:
    """
    Generate the first n prime numbers.
    
    Args:
        n (int): Number of primes to generate
        
    Returns:
        List[int]: List containing the first n prime numbers
    """
    limit = n * 20  # Estimate an upper bound
    while True:
        primes = sieve_of_eratosthenes(limit)
        if len(primes) >= n:
            return primes[:n]
        limit *= 2  # If we didn't get enough primes, double the limit and try again

def format_primes(primes: List[int]) -> str:
    """
    Format the list of primes for pretty printing.
    
    Args:
        primes (List[int]): List of prime numbers
        
    Returns:
        str: Formatted string of prime numbers
    """
    return '\n'.join(
        ' '.join(f"{prime:4}" for prime in primes[i:i+10])
        for i in range(0, len(primes), 10)
    )

if __name__ == '__main__':
    try:
        print(f"First {PRIME_COUNT} prime numbers:")
        primes = get_n_primes(PRIME_COUNT)
        print(format_primes(primes))
        print(f"\nTotal primes generated: {len(primes)}")
        print(f"Last prime: {primes[-1]}")
    except Exception as e:
        print(f"An error occurred: {e}")
