#!/usr/bin/env python3

"""
This script prints the first 50 even numbers.
Usage: python3 print_even_numbers.py
"""

def first_50_even_numbers():
    """
    Generate the first 50 even numbers.
    Returns:
        list: List of first 50 even numbers
    """
    return [n * 2 for n in range(1, 51)]

if __name__ == "__main__":
    numbers = first_50_even_numbers()
    print("The first 50 even numbers are:\n")
    for i, num in enumerate(numbers, 1):
        print(f"{i:3d}. {num}")
    
    # Verify we have exactly 50 numbers
    assert len(numbers) == 50, f"Expected 50 numbers, but got {len(numbers)}"
