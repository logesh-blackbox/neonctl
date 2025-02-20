
# This script prints the first 100 prime numbers.
# Usage: python3 print_primes.py

def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def first_100_primes():
    primes = []
    num = 2
    while len(primes) < 100:
        if is_prime(num):
            primes.append(num)
        num += 1
    return primes

if __name__ == "__main__":
    print("The first 100 prime numbers are:")
    print(first_100_primes())
