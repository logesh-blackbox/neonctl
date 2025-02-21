#!/usr/bin/env python3

def is_prime(n):
    """Check if a number is prime."""
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

def get_first_100_primes():
    """Generate the first 100 prime numbers."""
    primes = []
    num = 2
    while len(primes) < 100:
        if is_prime(num):
            primes.append(num)
        num += 1
    return primes

def main():
    """Print the first 100 prime numbers."""
    primes = get_first_100_primes()
    print("First 100 prime numbers:")
    # Print 10 numbers per line for better readability
    for i in range(0, len(primes), 10):
        line = primes[i:i + 10]
        print(" ".join(f"{num:4d}" for num in line))

if __name__ == "__main__":
    main()
