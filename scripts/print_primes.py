#!/usr/bin/env python3

def is_prime(n):
    """
    Check if a number is prime.
    Args:
        n (int): The number to check
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

def get_first_n_even(n):
    """
    Generate the first n even numbers.
    Args:
        n (int): Number of even numbers to generate
    Returns:
        list: List containing first n even numbers
    """
    return [2 * i for i in range(1, n + 1)]

def print_numbers(numbers, title):
    """
    Print numbers in a formatted way.
    Args:
        numbers (list): List of numbers to print
        title (str): Title to display before numbers
    """
    print(f"\n{title}:")
    for i in range(0, len(numbers), 10):
        line = numbers[i:i + 10]
        print(" ".join(f"{num:4d}" for num in line))

def main():
    """
    Main function to print the first 100 prime numbers and first 100 even numbers.
    """
    n = 100
    # Get and print prime numbers
    primes = get_first_n_primes(n)
    print_numbers(primes, f"First {n} prime numbers")
    
    # Get and print even numbers
    even_numbers = get_first_n_even(n)
    print_numbers(even_numbers, f"First {n} even numbers")

if __name__ == "__main__":
    main()
