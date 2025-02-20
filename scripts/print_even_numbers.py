#!/usr/bin/env python3

"""
This script prints the first 100 even numbers.
Usage: python3 print_even_numbers.py
"""

def first_100_even_numbers():
    """
    Generate the first 100 even numbers.
    Returns:
        list: List of first 100 even numbers
    """
    return [n * 2 for n in range(1, 101)]

if __name__ == "__main__":
    numbers = first_100_even_numbers()
    print("The first 100 even numbers are:\n")
    for i, num in enumerate(numbers, 1):
        print(f"{i:3d}. {num}")
    
    # Verify we have exactly 100 numbers
    assert len(numbers) == 100, f"Expected 100 numbers, but got {len(numbers)}"
