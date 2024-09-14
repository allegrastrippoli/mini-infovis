import random

for j in range(0,10):
    coordinates = [(random.uniform(0, 1000), random.uniform(0, 1000)) for _ in range(3)]    

    with open("data.txt", "a") as file:
        file.write("{")
        file.write(f"id: {j}, ")
        
        for  i, (x, y) in enumerate(coordinates, 1):
            file.write(f"x{i}: {int(x)}, y{i}: {int(y)}, ")
        file.write("},")
            
        file.write("\n")

