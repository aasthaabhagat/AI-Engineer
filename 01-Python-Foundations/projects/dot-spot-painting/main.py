# import colorgram

# rgb_colors = []
# colors = colorgram.extract('image.jpg', 30)
# for color in colors:
#     r = color.rgb.r
#     g = color.rgb.g
#     b = color.rgb.b
#     new_color = (r, g, b)
#     rgb_colors.append(new_color)
# print(rgb_colors)
import turtle as turtle_module
import random

turtle_module.colormode(255)
tim = turtle_module.Turtle()


tim.speed("fastest")    
tim.penup()
tim.hideturtle()
color_list = [(246, 239, 244), (236, 246, 241), (201, 158, 118), (59, 96, 132), (149, 85, 56), (220, 209, 117), (136, 164, 188), (20, 34, 51), (188, 145, 159), (51, 26, 18), (123, 73, 91), (132, 177, 155), (178, 161, 37), (55, 121, 76), (56, 25, 35), (200, 93, 75), (131, 27, 41), (153, 23, 14), (19, 44, 35), (184, 93, 111), (226, 169, 189), (41, 60, 100), (63, 164, 100), (225, 177, 168), (108, 119, 165), (24, 91, 55), (154, 211, 189)]

tim.setheading(225)
tim.forward(300)
tim.setheading(0)       
number_of_dots = 100

for dot_count in range(1, number_of_dots + 1):
    tim.dot(20, random.choice(color_list))
    tim.forward(50)

    if dot_count % 10 == 0:
        tim.setheading(90)
        tim.forward(50)
        tim.setheading(180)
        tim.forward(500)
        tim.setheading(0)










screen = turtle_module.Screen()
screen.exitonclick()