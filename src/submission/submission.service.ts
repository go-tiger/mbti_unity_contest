import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { lastValueFrom, map } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Submissions } from 'src/entities/Submissions';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Submissions)
    private submissionsRepository: Repository<Submissions>,
  ) {}

  async create(dto: CreateSubmissionDto) {
    const { bjname, titleNo } = dto;
    let allComments = [];
    let currentPage = 1;
    let lastPage = 1;

    do {
      const afComments = await lastValueFrom(
        this.httpService
          .get(
            `https://bjapi.afreecatv.com/api/${bjname}/title/${titleNo}/comment?orderby=like_cnt&page=${currentPage}`,
          )
          .pipe(map((response) => response.data)),
      );

      if (currentPage === 1) lastPage = afComments.meta.last_page;

      const fixComments = afComments.data.map((comment) => {
        const regex = /([a-zA-Z0-9_]+) *\/ *([A-Za-z]+)/;
        let splitComments = [];
        const match = comment.comment.match(regex);
        if (match) {
          splitComments.push(match[1], match[2]);
        } else {
          splitComments = comment.comment
            .split(/[\n\/]+/)
            .map((part) => part.trim())
            .map((part) => part.replace(/[!.?]+/g, ''))
            .map((part) => {
              const splitByColon = part.split(':').map((s) => s.trim());
              return splitByColon.length > 1 ? splitByColon[1] : splitByColon[0];
            });
        }

        if (splitComments[0]) {
          splitComments[0] = splitComments[0].replace(/[^a-zA-Z0-9_]+/g, '');
        }

        if (splitComments[1]) {
          const MBTI = splitComments[1].replace(/[^a-zA-Z]+/g, '');
          splitComments[1] = MBTI.slice(-4).toUpperCase();
        }

        splitComments = splitComments.slice(0, 2);

        return {
          pCommentNo: comment.p_comment_no,
          comment: comment.comment,
          userId: comment.user_id,
          userNick: comment.user_nick,
          minecraftId: splitComments[0],
          mbti: splitComments[1],
        };
      });

      allComments = allComments.concat(fixComments);

      currentPage++;
    } while (currentPage <= lastPage);

    const existingComments = await this.submissionsRepository.find({
      where: { pCommentNo: In(allComments.map((comment) => comment.pCommentNo)) },
    });

    const updatedComments = allComments.map((newComment) => {
      const existingComment = existingComments.find((existing) => existing.pCommentNo === newComment.pCommentNo);
      return existingComment ? { ...existingComment, ...newComment } : newComment;
    });
    return this.submissionsRepository.save(updatedComments);
  }
}
