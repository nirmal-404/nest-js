import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    description: string | undefined,
    user: User,
  ): Promise<File> {
    const cloudinaryResponse = await this.cloudinaryService.uploadFile(file);

    const newlyCreatedFile = this.fileRepository.create({
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      publicId: cloudinaryResponse?.public_id,
      url: cloudinaryResponse?.secure_url,
      description,
      uploader: user,
    });

    return this.fileRepository.save(newlyCreatedFile);
  }

  async findAll(): Promise<File[]> {
    return this.fileRepository.find({
      relations: ['uploader'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    const fileToBeDeleted = await this.fileRepository.findOne({
      where: { id },
    });

    if (!fileToBeDeleted) {
      throw new NotFoundException(`File with ID ${id} not found!`);
    }

    //delete from cloudinary
    await this.cloudinaryService.deleteFile(fileToBeDeleted.publicId);

    //delete from database ->
    await this.fileRepository.remove(fileToBeDeleted);
  }
}
