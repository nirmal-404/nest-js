import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class UpdatePostDto {
    @IsOptional()
    @IsNotEmpty({message: "Title is required"})
    @IsString({message: "Title must be a string"})
    @MinLength(3, {message: "Title must be at least 3 characters long"})
    @MaxLength(50, {message: "Title cannot be longer than 50 characters"})
    title?: string;

    @IsOptional()
    @IsNotEmpty({message: "Content is required"})
    @IsString({message: "Content must be a string"})
    @MinLength(5, {message: "Content must be at least 5 characters long"})
    content?: string;

    @IsOptional()
    @IsNotEmpty({message: "Author is required"})
    @IsString({message: "Author must be a string"})
    @MinLength(2, {message: "Author must be at least 2 characters long"})
    @MaxLength(25, {message: "Author cannot be longer than 25 characters"})
    authorName?: string;
}