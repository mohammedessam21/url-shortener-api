import { IsInt, IsNotEmpty, IsOptional, Matches, Min } from "class-validator";

export class CreateUrlShortenerDto {
    @IsNotEmpty()
    @Matches(/^https?:\/\/.+/, {
        message: 'originalUrl must start with http:// or https://',
    })
    originalUrl: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    expiresInDays?: number;
}
