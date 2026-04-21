output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (needed for cache invalidations in CI)"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "acm_certificate_arn" {
  description = "ARN of the ACM certificate"
  value       = aws_acm_certificate.site.arn
}

output "site_url" {
  description = "HTTPS URL for the site"
  value       = "https://${var.domain_name}"
}

output "route53_name_servers" {
  description = "Name servers for the Route 53 hosted zone — set these at your domain registrar"
  value       = aws_route53_zone.site.name_servers
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket hosting the site"
  value       = aws_s3_bucket.site.bucket
}
