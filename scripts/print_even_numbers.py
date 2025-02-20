#!/usr/bin/env python3

# This script prints the first 10 even numbers.
# Usage: python3 print_even_numbers.py

def first_10_even_numbers():
    '''Generate the first 10 even numbers'''
    even_numbers = []
    num = 0  # Start with 0 as it's the first even number
    while len(even_numbers) < 10:
        even_numbers.append(num)
        num += 2  # Increment by 2 to get next even number
    return even_numbers

if __name__ == "__main__":
    print("The first 10 even numbers are:")
    numbers = first_10_even_numbers()
    # Print one number per line for better readability
    for i, num in enumerate(numbers, 1):
        print(f"{i}. {num}")
