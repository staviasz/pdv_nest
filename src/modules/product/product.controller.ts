import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { IsValidImageFile } from 'src/utils/validator/IsValidImageFile';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new IsValidImageFile({
            mimetypes: ['image/jpeg', 'image/png', 'image/jpg'],
          }),
        ],
        errorHttpStatusCode: 404,
      }),
    )
    image?: Express.Multer.File,
  ) {
    return this.productService.create(createProductDto, image);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new IsValidImageFile({
            mimetypes: ['image/jpeg', 'image/png', 'image/jpg'],
          }),
        ],
        errorHttpStatusCode: 404,
      }),
    )
    image?: Express.Multer.File,
  ) {
    return this.productService.update(+id, updateProductDto, image);
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
