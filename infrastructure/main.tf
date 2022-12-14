terraform {
  backend "s3" {
    bucket = "scratchworks-tf-state"
    key    = "scratch"
    region = "us-east-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">=1.2.0"
}

provider "aws" {
  region = "us-east-1"
}

resource "tls_private_key" "scratchworks_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "scratchworks_key_pair" {
  key_name   = "scratchworks key pair"
  public_key = tls_private_key.scratchworks_key.public_key_openssh
}

resource "aws_instance" "scratchworks_instance" {
  ami                    = "ami-0574da719dca65348"
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.scratchworks_key_pair.key_name
  vpc_security_group_ids = ["sg-0423be618a834b918"]

  tags = {
    Name = "scratchworks instance"
  }
}

output "private_key" {
  value     = tls_private_key.scratchworks_key.private_key_pem
  sensitive = true
}

output "dns_address" {
  value = aws_instance.scratchworks_instance.public_dns
}
